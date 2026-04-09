/**
 * script.js
 * 纯原生实现滚动视差、淡入动效，对标苹果官网丝滑交互
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Intersection Observer API 实现滚动元素淡入视差效果
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // 元素出现 15% 时触发
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 添加可见类名触发 CSS3 动画
                entry.target.classList.add('visible');
                // 动画触发一次后解除观察，优化性能
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 获取所有需要出现动效的元素
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // 2. 顶部导航栏滚动模糊加深效果 (还原苹果滚动细节)
    const nav = document.querySelector('.global-nav');
    
    // 使用 requestAnimationFrame 优化滚动事件性能
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 20) {
                    // 向下滚动加深背景
                    nav.style.background = 'rgba(0, 0, 0, 0.85)';
                } else {
                    // 回到顶部恢复默认
                    nav.style.background = 'rgba(0, 0, 0, 0.8)';
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // passive 提升滚动帧率

    // 3. 平滑滚动跳转 (点击导航链接时)
    const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 减去导航栏的高度 (44px) 加上一点留白
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 44;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
