/**
 * 滚动到某个id位置
 */

module.exports = (selector, time=1000) => {
    $('html body').animate({
        scrollTop: $(selector).offset().top
    }, time);
};