const url = 'assets/docs/TomMonckResume.pdf';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
const { pdfjsLib, PDFViewerApplication } = globalThis;
// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs';

let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.4,
    canvas = document.getElementById('resume'),
    ctx = canvas.getContext('2d');

/**
 * Get annotation data and render the annotation layer
 */
async function addAnnotations(context, viewport, page) {
  const container = document.getElementById('pdf-container');
  const annotationsData = await page.getAnnotations();
  const canvasRect = canvas.getBoundingClientRect();
  annotationsData.forEach(annotation => {
        if (annotation.subtype === 'Link') {
          const rect = annotation.rect;
          const scale = viewport.scale;
          const x = (rect[0] * scale) + canvasRect.left;
          const width = (rect[2] - rect[0]) * scale;
          const height = (rect[3] - rect[1])* scale;
          // This worked for a bit till I adjusted the pdfNav section. I'm keeping for historical context
          // const y = ((viewport.height * scale) - (rect[1] * scale)) - canvasRect.top;
          // Eveything lined up except the y axis was off by the height of the rect.
          const y =  (canvasRect.bottom - height) - (rect[1] * scale) ;


          // Create a hyperlink overlay
          const linkDiv = document.createElement('div');
          linkDiv.className = 'link-annotation';
          linkDiv.style.left = `${x}px`;
          linkDiv.style.top = `${y}px`;
          linkDiv.style.width = `${width}px`;
          linkDiv.style.height = `${height}px`;
          linkDiv.title = annotation.url; // Hover text

          // Click event to open the URL
          linkDiv.addEventListener('click', () => {
              window.open(annotation.url, '_blank');
          });

          document.getElementById('pdf-container').appendChild(linkDiv);
        }
    });
};

function clearAnnotations() {
    const linkAnnotations = document.querySelectorAll('.link-annotation');
    linkAnnotations.forEach(link => link.remove());
}

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
async function renderPage(num) {
  pageRendering = true;
  // Using promise to fetch the page
  const page = await pdfDoc.getPage(num);
  const actualScale = Math.min(window.outerWidth / page.getViewport({scale: scale}).width, 1.4);
  const viewport = page.getViewport({scale: actualScale});
  // const viewport = page.getViewport({scale: scale});
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // Render PDF page into canvas context
  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };
  // Clear canvas and existing annotations
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearAnnotations();
  const renderTask = page.render(renderContext);

  // Wait for rendering to finish
  await renderTask.promise;
  await addAnnotations(ctx, viewport, page);
  pageRendering = false;
  if (pageNum <= 1) {
      document.getElementById('prev').classList.remove("visible");
  } else {
      document.getElementById('prev').classList.add("visible");
  }
  if (pageNum >= pdfDoc.numPages) {
      document.getElementById('next').classList.remove("visible");
  } else {
      document.getElementById('next').classList.add("visible");
  }
  if (pageNumPending !== null) {
    // New page rendering is pending
    renderPage(pageNumPending);
    pageNumPending = null;
  }
  // Update page counters
  document.getElementById('page_num').textContent = num;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
document.getElementById('next').addEventListener('click', onNextPage);

/**
 * Asynchronously downloads PDF.
 */
const pdfDoc_ = await pdfjsLib.getDocument(url).promise;
pdfDoc = pdfDoc_;
document.getElementById('page_count').textContent = pdfDoc.numPages;

// Initial/first page rendering
renderPage(pageNum);
