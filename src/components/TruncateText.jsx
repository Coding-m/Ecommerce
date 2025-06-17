export const truncateText=(text,charLimit)=>{
  if(text?.length>charLimit){
    return text.substring(0,charLimit)+"...";
    
  }
     return text;
};

export default truncateText;