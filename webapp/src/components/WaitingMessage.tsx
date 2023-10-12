import ListGroup from "react-bootstrap/ListGroup";
import GoogleButton from "./GoogleButton";
import { ReactElement } from "react";
import { UserContext } from "../util/types";
import { useContext } from "react";

const WaitingMessage = () => {
  const userContext = useContext(UserContext);

  let providerItem: ReactElement | null = null;

  if (userContext.userData !== null) {
    providerItem = (
      <ListGroup.Item>
        <GoogleButton />
      </ListGroup.Item>
    );
  }
  return (
    <ListGroup>
      {providerItem}
      <ListGroup.Item>
        <span className="fw-bold">English</span> : We depend on the speed of the network and your device to display your calendar data,
        please wait a moment.
      </ListGroup.Item>
      <ListGroup.Item>
        <span className="fw-bold">Español</span> : Dependemos de la velocidad de la red y la de tu dispositivo para mostrar los datos de tu
        agenda, por favor espera un momento.
      </ListGroup.Item>
      <ListGroup.Item>
        <span className="fw-bold">Deutsch</span> : Die Anzeige Ihrer Kalenderdaten hängt von der Geschwindigkeit des Netzes und Ihres Geräts
        ab. Bitte warten Sie einen Moment.
      </ListGroup.Item>
      <ListGroup.Item>
        <span className="fw-bold">Français</span> : Nous dépendons de la vitesse du réseau et de votre appareil pour afficher les données de
        votre calendrier, veuillez patienter un moment.
      </ListGroup.Item>
      <ListGroup.Item>
        <span className="fw-bold">Italiano</span>: La visualizzazione dei dati del calendario dipende dalla velocità della rete e del
        dispositivo, si prega di attendere un momento.
      </ListGroup.Item>
      <ListGroup.Item>
        <span className="fw-bold">Português</span>: Dependemos da velocidade da rede e do seu dispositivo para apresentar os dados do
        calendário. Aguarde um momento.
      </ListGroup.Item>
    </ListGroup>
  );
};

export default WaitingMessage;
