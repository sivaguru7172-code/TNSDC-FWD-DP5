// ---------- Snowfall effect on canvas ----------
(function snowInit(){
  const canvas = document.getElementById('snow-canvas');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const flakes = [];
  const FLake_COUNT = Math.floor((w*h)/50000); // more area -> more flakes

  function rand(min,max){ return Math.random()*(max-min)+min; }
  for(let i=0;i<FLake_COUNT;i++){
    flakes.push({
      x: rand(0,w),
      y: rand(0,h),
      r: rand(1.2,4.2),
      d: rand(0.5,1.5), // density / speed factor
      vx: rand(-0.3,0.3),
      vy: rand(0.3,1.2)
    });
  }
  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', ()=>{
    resize();
  });

  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    for(let f of flakes){
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
    }
    ctx.fill();

    // update positions
    for(let f of flakes){
      f.x += f.vx * f.d;
      f.y += f.vy * f.d;
      // slight sway
      f.vx += Math.sin((f.y/50))*0.002;
      if(f.x > w + 10) f.x = -10;
      if(f.x < -10) f.x = w + 10;
      if(f.y > h + 10){
        f.y = -10;
        f.x = Math.random()*w;
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ---------- Lightbox for gallery ----------
function openLightbox(src){
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  lb.style.display = 'flex';
}
function closeLightbox(){
  const lb = document.getElementById('lightbox');
  lb.style.display = 'none';
}
document.getElementById('lightbox').addEventListener('click', closeLightbox);

// ---------- Details modal (cottages) ----------
function openDetails(title, desc, img){
  const m = document.getElementById('detailsModal');
  document.getElementById('details-title').textContent = title;
  document.getElementById('details-desc').textContent = desc;
  document.getElementById('details-img').src = img;
  m.style.display = 'flex';
}
function closeDetails(e){
  const m = document.getElementById('detailsModal');
  // avoid closing when clicking inside content (only close on backdrop or close btn)
  if(e && e.target && (e.target.classList.contains('modal') || e.target.classList.contains('close'))){
    m.style.display = 'none';
  } else if (!e) {
    m.style.display = 'none';
  }
}
document.querySelectorAll('.modal .close').forEach(btn=>{
  btn.addEventListener('click', ()=> closeDetails({target:btn}));
});

// ---------- Booking form logic ----------
function calculateTotal(){
  const sel = document.getElementById('cottage');
  const nights = parseInt(document.getElementById('nights').value) || 1;
  const price = parseInt(sel.selectedOptions[0].dataset.price || 6500, 10);
  document.getElementById('unit').textContent = '₹' + price;
  document.getElementById('nspan').textContent = nights;
  document.getElementById('total').textContent = '₹' + (price * nights);
}
document.addEventListener('DOMContentLoaded', ()=>{
  calculateTotal();
  // booking submit
  document.getElementById('bookingForm').addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('bfname').value.trim();
    if(!name){ alert('Enter name'); return; }
    alert('Thanks ' + name + '! Your demo booking is received. (This is a demo site.)');
    this.reset();
    calculateTotal();
  });

  // close modals via Escape
  document.addEventListener('keydown', (ev)=>{
    if(ev.key === 'Escape'){
      closeLightbox();
      closeDetails({target: {classList: ['modal']}}); // will close backdrop
    }
  });
});