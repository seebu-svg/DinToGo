const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="text-center py-16">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-charcoal-50 flex items-center justify-center mx-auto mb-4">
          <Icon size={28} className="text-charcoal-300" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-charcoal-700 mb-2">{title}</h3>
      {description && <p className="text-charcoal-400 text-sm mb-4 max-w-md mx-auto">{description}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
