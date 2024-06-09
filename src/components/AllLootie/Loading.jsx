import Lottie from 'lottie-react';
import loading from '../../assets/loading-infinite-red.json';

const style = { width: '300px' };

const Loading = () => {
  return (
    <div>
      <Lottie style={style} animationData={loading} loop={true} autoplay={true} />
    </div>
  );
};

export default Loading;
