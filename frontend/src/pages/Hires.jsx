

export default function Hires() {


  return (
    <div className="relative bg-cover bg-center h-screen flex flex-col justify-center items-center text-blue-300 px-6"
      style={{ backgroundImage: "url('https://kangaroocabs.com/your-background-image.jpg')" }}>
      
      <h1 className="text-4xl font-bold text-center">Your Journey with Travelia Cabs<br /><span className="text-blue-600">Starts Here</span></h1>
      <p className="text-lg mt-2">Your safety and comfort is our concern</p>
      
      <div className="mt-6 flex space-x-4">
        <Link to='/pick'>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">Airport Pickup</button>
        </Link>
        <link to='/drop'>
        <button className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg" >Airport Drop</button>
        </link>
      </div>
 
    </div>
  );
}