import Lottie from 'lottie-react';
import error from '../../assets/error.json';
const style = {
  width: '300px',
};
const Error = () => {
  return (
    <div>
      <Lottie style={style} animationData={error} loop={true} autoplay={true} />
    </div>
  );
};

export default Error;
