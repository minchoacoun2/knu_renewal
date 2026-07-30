document.addEventListener('DOMContentLoaded', () => {
  const scrollSections = [
    document.querySelector('.main-visual'),
    ...document.querySelectorAll('#wrap > section'),
    document.querySelector('#wrap > footer'),
  ].filter(Boolean);

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  let isScrolling = false;
  let unlockTimer;

  const getCurrentSectionIndex = () => {
    const currentY = window.scrollY;

    return scrollSections.reduce((closestIndex, section, index) => {
      const currentDistance = Math.abs(
        scrollSections[closestIndex].offsetTop - currentY
      );
      const nextDistance = Math.abs(section.offsetTop - currentY);

      return nextDistance < currentDistance ? index : closestIndex;
    }, 0);
  };

  const moveToSection = (index) => {
    const target = scrollSections[index];

    if (!target) return;

    isScrolling = true;
    window.scrollTo({
      top: target.offsetTop,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    window.clearTimeout(unlockTimer);
    unlockTimer = window.setTimeout(() => {
      isScrolling = false;
    }, prefersReducedMotion ? 100 : 850);
  };

  if (
    !document.body.classList.contains('intro-page') &&
    !document.body.classList.contains('admission-page') &&
    !document.body.classList.contains('education-page') &&
    !document.body.classList.contains('campus-page') &&
    !document.body.classList.contains('promotion-page')
  ) {
    window.addEventListener(
      'wheel',
      (event) => {
        if (
          isScrolling ||
          Math.abs(event.deltaY) < 10 ||
          event.ctrlKey ||
          event.target.closest('input, textarea, select')
        ) {
          return;
        }

        const currentIndex = getCurrentSectionIndex();
        const direction = event.deltaY > 0 ? 1 : -1;
        const nextIndex = Math.min(
          Math.max(currentIndex + direction, 0),
          scrollSections.length - 1
        );

        if (nextIndex === currentIndex) return;

        event.preventDefault();
        moveToSection(nextIndex);
      },
      { passive: false }
    );
  }

  const goTopButton = document.createElement('button');
  goTopButton.type = 'button';
  goTopButton.className = 'go-top';
  goTopButton.setAttribute('aria-label', '페이지 맨 위로 이동');
  goTopButton.innerHTML = '<span aria-hidden="true"></span><strong>TOP</strong>';
  document.body.appendChild(goTopButton);

  const updateGoTopButton = () => {
    goTopButton.classList.toggle('is-visible', window.scrollY > 300);
  };

  goTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  });
  window.addEventListener('scroll', updateGoTopButton, { passive: true });
  updateGoTopButton();
});
