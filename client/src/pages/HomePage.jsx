import { useState } from "react";

import Topbar from "../components/Topbar";
import { Button, Card, CardBody, Form, Input } from "@heroui/react";

function HomePage() {
  const [action, setAction] = useState(null);

  return (
    <div>
      <Topbar />
      <div className="body">
        <div>
          <div>
            <div>
              <h1 className="font-bold" style={{ maxWidth: "450px" }}>
                Maneja tu camino con nostros
              </h1>
              <Card>
                <CardBody>
                  <h2 className="font-bold">¡Alquila tu vehículo ya!</h2>
                  <Form
                    className="w-full max-w-xs flex flex-col gap-4"
                    onReset={() => setAction("reset")}
                    onSubmit={(e) => {
                      e.preventDefault();
                      let data = Object.fromEntries(
                        new FormData(e.currentTarget)
                      );

                      setAction(`submit ${JSON.stringify(data)}`);
                    }}
                  >
                    <Input
                      isRequired
                      errorMessage="Please enter a valid username"
                      label="Username"
                      labelPlacement="outside"
                      name="username"
                      placeholder="Enter your username"
                      type="text"
                    />

                    <Input
                      isRequired
                      errorMessage="Please enter a valid email"
                      label="Email"
                      labelPlacement="outside"
                      name="email"
                      placeholder="Enter your email"
                      type="email"
                    />
                    <div className="flex gap-2">
                      <Button color="primary" type="submit">
                        Submit
                      </Button>
                      <Button type="reset" variant="flat">
                        Reset
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
