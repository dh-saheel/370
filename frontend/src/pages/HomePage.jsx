import BannerImg from '../assets/bannerImg.svg';
import TempLogo from '../assets/tempLogo.svg';

function HomePage() {
  return (
    <section className="grid grid-cols-2 gap-8 items-center justify-center px-8 py-16 mx-auto min-h-full">
        <div className="landing-text text-left pl-20">
            <img src={TempLogo} alt="Logo" className="h-32 mb-4" />
            <h1 className="text-5xl font-bold mb-4">Welcome to 5StarCourses</h1>
            <p>Find a Course of your liking</p>
            {/* TODO: 
                Add a course search form here 
            */}
        </div>
        <div className="landing-img">
            <img src={BannerImg} alt="Banner" className="w-8/12 h-auto" />
        </div>
    </section>
  );
}

export default HomePage;