function pathToFile(path){
  const p = path.replace(/^\/+|\/+$/g,'');
  return (p === '' ? 'index.html' : p + '.html');
}

function updateActiveLinks(path){
  document.querySelectorAll('.nav-link').forEach(a=>{
    const href = a.getAttribute('href') || '';
    const target = href.replace(/^\//, '').replace(/\.html$/, '') || 'index';
    const cleanPath = path.replace(/^\//, '').replace(/\/+$/,'') || 'index';
    if(target === cleanPath){
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

function setMainHtml(html){
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const main = doc.querySelector('main') || doc.body;
  const dest = document.getElementById('main');
  if(dest){
    dest.innerHTML = main.innerHTML;
    // execute any scripts that came with the fetched content
    const scripts = main.querySelectorAll('script');
    scripts.forEach(s => {
      const ns = document.createElement('script');
      if(s.src){ ns.src = s.src; ns.async = false; document.body.appendChild(ns); }
      else { ns.textContent = s.textContent; document.body.appendChild(ns); }
    });
  }
}

async function loadPath(path, replace=false){
  const file = pathToFile(path);
  try{
    const res = await fetch(file, {cache: 'no-store'});
    if(!res.ok) throw new Error('Not found');
    const text = await res.text();
    setMainHtml(text);
    updateActiveLinks(path);
    if(replace) history.replaceState({}, '', path);
    else history.pushState({}, '', path);
  }catch(e){
    console.warn('SPA router: failed to load', file);
  }
}

document.addEventListener('click', function(e){
  const a = e.target.closest('a');
  if(!a) return;
  const href = a.getAttribute('href');
  if(!href) return;
  if(href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || a.target === '_blank') return;
  // internal navigation
  if(href.endsWith('.html')){
    e.preventDefault();
    const path = '/' + href.replace(/\.html$/, '');
    loadPath(path);
  } else if(href.startsWith('/')){
    e.preventDefault();
    loadPath(href);
  }
});

window.addEventListener('popstate', function(){
  loadPath(location.pathname, true);
});

document.addEventListener('DOMContentLoaded', function(){
  // on initial load, ensure main is populated from the correct file
  loadPath(location.pathname, true);
});
