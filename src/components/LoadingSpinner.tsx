import { Spinner } from "react-bootstrap";

type Props = {
	disableAnimation?: boolean;
};

export const LoadingSpinner = ({ disableAnimation }: Props) => (
	<Spinner animation={disableAnimation ? undefined : "border"} role={"status"}>
		<span className={"visually-hidden"}>Loading...</span>
	</Spinner>
);
