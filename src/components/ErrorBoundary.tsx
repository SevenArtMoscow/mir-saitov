import React from 'react';

// Если ленивый кусок не загрузился (плохая сеть или после обновления сайта старый файл уже удалён) —
// вместо белого экрана показываем кнопку «Обновить». Для необязательных частей (3D) можно передать свой `fallback`.
interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<Props, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: unknown) {
    console.error(e);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    return (
      <div className="grid h-[100svh] place-items-center p-6 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-haze">Не удалось загрузить часть сайта</p>
          <button onClick={() => location.reload()} className="mt-5 rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/10">
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }
}
