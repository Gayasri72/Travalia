import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';

function OAuth() {
  return (
    <Button
      type="button"
      gradientDuoTone="purpleToBlue"
      className="w-1/2 flex items-center gap-2"
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}

export default OAuth;
