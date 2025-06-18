import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@heroui/react";

import Topbar from "../components/Topbar";
import ReserveCard from "../components/ReserveCard";
import { PageLayout } from "../components/PageLayout";

function HomePage() {
  return (
    <PageLayout>
      <section className="bg-[url(/../commons/obi-aZKJEvydrNM-unsplash.jpg)] min-h-screen bg-cover flex flex-col gap-5 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 " />
        <div className="w-[70%] mx-auto z-10 mt-[80px]">
          <div className="flex flex-col w-full gap-5">
          <div>
            <h1 className="text-white font-bold text-4xl mb-4">
              Manejá tu camino con nosotros
            </h1>
            <div className="flex w-full justify-between gap-5">
              <ReserveCard />
              <Card className="w-full bg-background/60" isBlurred>
                <CardHeader>
                  <h1 className="text-black font-bold text-xl">
                    Tu próximo viaje arranca acá, sin letra chica
                  </h1>
                </CardHeader>
                <Divider />
                <CardBody className="text-sm">
                  <p className="mb-2">
                    En <strong>AlquilAppCar</strong> creamos una forma simple y
                    confiable de alquilar vehículos para quienes quieren viajar
                    sin complicaciones. Sin letra chica, sin intermediarios
                    confusos.
                  </p>
                  <p className="mb-2">
                    Podés buscar autos disponibles en tu zona, elegir las fechas
                    que necesitás, y coordinar la entrega directamente desde
                    nuestra plataforma. Nos enfocamos en brindarte confianza,
                    flexibilidad y un trato humano.
                  </p>
                </CardBody>
                <Divider />
              </Card>
            </div>
            </div>
            <h1 className="text-white font-bold text-4xl mb-4">
              Categorías disponibles // reviews? // sucursales
            </h1>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default HomePage;
