let observer; // global observer variable

//For the header buttons
var curPage = '';
            
function showPage(daPage) {
    if (curPage == daPage)
        return;
    
    const pages = document.querySelectorAll('.page');
    curPage = daPage;

    pages.forEach(page => {
        page.style.display = 'none';
    });

    const newPage = document.getElementById(daPage);
    newPage.style.display = 'block';

    const animatedEls = newPage.querySelectorAll('.trans-in');
    animatedEls.forEach(e => {
        e.classList.remove('visible');
        observer.observe(e);
    });

    document.getElementById(daPage).style.display = 'block';

    setupObserver();

    if (daPage == 'devlog'){
        loadPosts();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    showPage('overview');
});

function setupObserver() {
    if (observer) return; // only create once

    observer = new IntersectionObserver((entries) => { 
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // stop observing after visible
            }
        });
    }, { threshold: 0.1 });
}

function observeElements(elements) {
  elements.forEach(el => observer.observe(el));
}

//fancy shit as you scroll down and load more elements
document.addEventListener('DOMContentLoaded', function () {
    setupObserver();

    const elements = document.querySelectorAll('.trans-in');
    observeElements(elements);
});

//background scrolling yeah!!

let latestScrollY = 0;
let ticking = false;

function onScroll() {
  latestScrollY = window.scrollY;
  requestTick();
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

function updateParallax() {
  const offset = latestScrollY * 0.5;
  document.body.style.backgroundPosition = `0px ${offset}px`;
  ticking = false;
}

window.addEventListener('scroll', onScroll);

//oh no
//devlog stuff

function coolMarkdowns(text)
{
    /*
    MARKDOWN FORMATTING

    nothing - normal text lol

    # - header 1
    ## - header 2
    ### - header 3

    ** - bold

    \n - new line

    ! - images
    @ - video
    */

    return text
     .replace(/^### (.*)$/gim, '<h3>$1</h3>')
     .replace(/^## (.*)$/gim, '<h2>$1</h2>')
     .replace(/^# (.*)$/gim, '<h1>$1</h1>')

     .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')

     .replace(/\\n/g, '<br>')

     .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1">')
     .replace(/@\[video\]\((.*?)\)/gim, '<video controls src="$1"></video>');
}

async function loadPosts()
{
    const r = await fetch('devlogs/devlogs.json');
    const posts = await r.json();
    const cont = document.getElementById('devlog');
    cont.innerHTML = '';

    posts.forEach(p => {
        const div = document.createElement("div");
        div.className = 'post trans-in from-bottom';
        div.dataset.date = p.date;
        div.dataset.author = p.author;

        var a = p.author;
        if (a == 'GadgetChrome')
        {
            a = p.author.replace('o', 'ø');
        }

        const markdownStuff = coolMarkdowns(p.content);

        div.innerHTML = `<div class="post-date">${p.date}</div>
                        <div class="author-meta">
                            <img src="img/${p.author.toLowerCase()}.png" class="author-avatar">
                            <span class="author-name">${a}</span>
                        </div>
                        <h2>${p.title}</h2>
                        <div class="post-body">${markdownStuff}</div>`;

        cont.appendChild(div);

        observer.observe(div);
    });

    renderPosts();
}