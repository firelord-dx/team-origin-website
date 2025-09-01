//For the header buttons
var curPage = '';
            
function showPage(daPage) {
    if (curPage == daPage)
        return;
    
    const pages = document.querySelectorAll('.page');
    curPage = daPage;

    pages.forEach(page => {
        page.style.display = 'none';

        page.querySelectorAll('.trans-in').forEach(e => {
            e.classList.remove('visible');
        });
    });

    document.getElementById(daPage).style.display = 'block';

    switch (daPage){
        case 'home':
            document.title = "Home - Team Origin";
            break;
        case 'projects':
            document.title = "Projects - Team Origin";
            break;
        case 'team':
            document.title = "Team - Team Origin";
            break;
        }
}

window.onload = () => showPage('home');

//fancy shit as you scroll down and load more elements
document.addEventListener('DOMContentLoaded', function () {
    const elements = document.querySelectorAll('.trans-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) 
            {
                entry.target.classList.add('visible');
            }
        });
    }, {
    threshold: 0.1
    });

    elements.forEach(e => observer.observe(e));
});