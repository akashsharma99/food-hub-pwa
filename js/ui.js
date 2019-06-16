document.addEventListener('DOMContentLoaded',function(){
    //nav menu
    const menu=document.querySelectorAll('.side-menu');
    M.Sidenav.init(menu,{edge: 'right'});
    //add recipe form
    const forms=document.querySelectorAll('.side-form');
    M.Sidenav.init(forms,{edge:'left'});
});