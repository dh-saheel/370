const SelectCard = ({ label, subLabel, selected, onClick }) => {
    return (
        <div className="hover:opacity-90 active:scale-95 transition-all cursor-pointer" 
            onClick={onClick} 
            style={{
            backgroundColor: selected ? "#7F77DD" : "white",
            color: selected ? "white" : "black",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            padding: "14px 18px",
            cursor: "pointer"
        }}>
            <div>{label}</div>
            {subLabel && <div style={{ fontSize: "12px", opacity: 0.7 }}>{subLabel}</div>}
        </div>
    )
}

export default SelectCard;