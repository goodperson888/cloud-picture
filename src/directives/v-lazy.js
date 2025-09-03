export default {
  mounted(el, binding) {
    // 如果已经有src，先清空它，让懒加载生效
    const originalSrc = binding.value;
    el.dataset.src = originalSrc;
    el.src = ''; // 先清空src，让图片不立即加载

    function loadImage() {
      if (el.dataset.src) {
        el.src = el.dataset.src;
      }
    }

    function handleIntersect(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage();
          observer.unobserve(el);
        }
      });
    }

    // 设置一个占位符或加载中的图片
    if (!el.src) {
      el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwMCAxNjYuNTY5IDE4Ni41NjkgMTgwIDE3MCAxODBIMTMwQzExMy40MzEgMTgwIDEwMCAxNjYuNTY5IDEwMCAxNTBDMTAwIDEzMy40MzEgMTEzLjQzMSAxMjAgMTMwIDEyMEgxNzBDMTg2LjU2OSAxMjAgMjAwIDEzMy40MzEgMjAwIDE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
    }

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });
    observer.observe(el);
  },
};