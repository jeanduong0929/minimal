import Navbar from "@/components/navbar/navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-screen-lg mx-auto w-11/12 flex flex-col items-center justify-center h-[80vh] fade-in">
        <h1 className="font-bold text-5xl slide">Minimal Todo.</h1>
      </div>
    </>
  );
};

export default Home;
