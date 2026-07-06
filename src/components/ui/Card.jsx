function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`rounded-[20px] border border-slate-200 bg-white/90 p-6 shadow-[0_16px_45px_-18px_rgba(15,23,42,0.24)] backdrop-blur ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
