const Status = ({ text, icon: Icon, bg, color }) => {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${bg} ${color}`}>
        {text}
        {Icon && <Icon size={15} />}
      </div>
    );
  };
  
  export default Status;
  