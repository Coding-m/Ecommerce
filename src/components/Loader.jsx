import { ColorRing } from "react-loader-spinner";

const Loader = ({text}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[300px]">
      <ColorRing
        visible={true}
        height={60}
        width={60}
        ariaLabel="loading"
        wrapperClass="color-ring-wrapper"
        colors={['#8B0000']} 
      />
       <p className="mt-4 text-red-800 text-lg font-medium">{text?text:"Please Wait..."}</p>
    </div>
  );
};

export default Loader;
