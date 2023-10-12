import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

interface LoadingButtonProps {
  variant: string;
  buttonText : string;
  loadingText : string | undefined;
  size: "lg" | "sm" | undefined;
  disabled: boolean;
  href: string;
  type: "button" | "reset" | "submit" | null;
  handleOnClick: (event: object, callback: () => void) => void;
}

const LoadingButton = (props: LoadingButtonProps) => {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    function simulateNetworkRequest() {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (isLoading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const callback = () => setLoading(false);

  const disabled = props.disabled !== undefined ? props.disabled : false;

  const loadingText = props.loadingText !== undefined ? props.loadingText : "Loading ...";

  return (
    <Button
      variant={props.variant}
      size={props.size}
      disabled={disabled}
      onClick={(e: object) => {
        setLoading(true);
        props.handleOnClick(e, callback);
      }}
    >
      {isLoading ? loadingText : props.buttonText}
    </Button>
  );
};

export default LoadingButton;
