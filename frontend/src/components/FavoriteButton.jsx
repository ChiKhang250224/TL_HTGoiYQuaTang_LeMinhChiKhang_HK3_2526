export default function FavoriteButton({ favorite, onClick, iconOnly = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${
        iconOnly
          ? 'flex h-10 w-10 items-center justify-center rounded-full shadow-sm'
          : 'inline-flex items-center justify-center gap-2 rounded-xl border-2 px-5 py-3 font-bold'
      } ${
        favorite
          ? 'border-error bg-error-container text-error'
          : 'border-primary bg-white text-primary hover:bg-primary hover:text-white'
      } transition-colors ${className}`}
      aria-label={favorite ? 'Bỏ khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
      aria-pressed={favorite}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontVariationSettings: favorite ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
      {!iconOnly && (favorite ? 'Đã yêu thích' : 'Thêm vào yêu thích')}
    </button>
  );
}
