// function font() {
//     document.documentElement.style.fontSize =
//         document.documentElement.clientWidth / 7.5 + 'px'
// }
// font()

// window.onresize = font()


screen = () => {
    // 获取屏幕的高度
    var html = document.documentElement;
    var windowWidth = html.clientWidth;
    // 设置html的font-size
    html.style.fontSize = windowWidth * 100 / 1718 + 'px';
};


window.onresize = screen;
window.addEventListener('load', screen, false);