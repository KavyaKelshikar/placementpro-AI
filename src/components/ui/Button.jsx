function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2';
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100',
    ghost: 'text-slate-700 hover:bg-slate-100',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
