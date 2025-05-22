import Topbar from "../components/Topbar";
import ReserveCard from "../components/ReserveCard";
import { PageLayout } from "../components/PageLayout";

function HomePage() {
    return (
        <PageLayout>
            <section className="bg-[url(/../commons/obi-aZKJEvydrNM-unsplash.jpg)] min-h-screen bg-cover flex flex-col gap-5 relative">
                <div style={{ height: "250px" }}></div>
                <div className="absolute top-0 left-0 w-full h-full bg-black/40 " />
                <div className="w-[70%] mx-auto z-10">
                    <h1 className="text-white font-bold text-left text-5xl mb-4">
                        Maneja tu camino <br /> con nosotros
                    </h1>
                    <ReserveCard />
                </div>
            </section>
        </PageLayout>
    );
}

export default HomePage;
