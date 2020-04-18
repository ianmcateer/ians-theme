import * as React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';

import PortDropdown from 'client/components/PortDropdown';
import { InfoPopup } from 'client/components/popups';
import styles from './styles.less';

import ROUTES from 'client/route-constants';
import { LOCAL_STORAGE_KEY } from 'client/pages/network/connections/create/ibm-cloud/reducer';
import Actions from '../actions';

interface PortOptions {
	key: string;
	portId: string;
	portName: string;
	availableBandwidth: string;
	portLocation: string;
	paymentType: string;
}

interface Props {
	isTouched: boolean;
	srcPorts: {
		isLoading: boolean;
		error: any;
		items: Array<PortOptions>;
	};
	destPorts: {
		isLoading: boolean;
		error: any;
		items: Array<PortOptions>;
	};
	srcPortId: string;
	destPortId: string;
	updateFormValue: (key: string, value: string) => void;
	errors: any;
	loadSrcPort: () => void;
	loadDestPort: () => void;
}

export function PortsSelect(props: Props) {
	const { errors, srcPorts, destPorts, srcPortId, destPortId, updateFormValue, loadSrcPort, loadDestPort } = props;

	const history = useHistory();
	const [showError, setShowError] = React.useState(false);

	function nextStep() {
		if (!srcPortId || !destPortId) {
			setShowError(true);
		}
		if (errors) return;

		history.push('/network/connections/create/ibm-cloud/connection');
	}

	React.useEffect(() => {
		loadSrcPort();
		loadDestPort();
	}, []);

	const clearFormStateFromLocalStorage = () => {
		localStorage.removeItem(LOCAL_STORAGE_KEY);
	};

	return (
		<Form
			onSubmit={nextStep}
			render={({ handleSubmit }) => (
				<form onSubmit={handleSubmit} className={classNames(styles.PortsSelect)} data-testid="cc-port-form">
					<h3>Ports</h3>
					<p>Select the source and destination of your connection.</p>

					<div className="cc-plans-only-box">
						<p>
							IBM Cloud is only available on plans. Only ports with plans will be listed below. Credit
							card and invoice payment options coming soon.
						</p>
					</div>

					<div className="cc-select-port">
						<Field name="src-port">
							{() => (
								<PortDropdown
									name="src-port"
									onChange={(portId) => updateFormValue('srcPortId', portId)}
									optionsData={srcPorts}
									testId="src-port"
									value={srcPortId}
									labelText="Source port"
									hasError={errors && showError && errors.srcPortId}
								/>
							)}
						</Field>
					</div>

					<div className={'cc-select-port'}>
						<label>Interconnect destination</label>
						<InfoPopup className="item" rightAligned={false} position="top center">
							The IBM port you wish to connect to.
						</InfoPopup>
						<Field name="dest-port" className="item">
							{({ input, meta }) => (
								<PortDropdown
									name="dest-port"
									onChange={(portId) => updateFormValue('destPortId', portId)}
									optionsData={destPorts}
									testId="dest-port"
									value={destPortId}
									hasError={errors && showError && errors.destPortId}
								/>
							)}
						</Field>
					</div>

					<div className="cc-connection-create-navigation">
						<button
							type="submit"
							className="ui primary button ports-next-button"
							data-testid="ports-next-button"
						>
							Next: Connection
						</button>
						<Link
							to={ROUTES.NETWORK_CONNECTION_CREATE_SEARCH}
							onClick={clearFormStateFromLocalStorage}
							className="ui secondary basic button"
						>
							Cancel
						</Link>
					</div>
				</form>
			)}
		/>
	);
}

// HOC that translates generic 'state' and 'dispatch' props
// into actual props for the component
// This is similar to what 'connect()' does in Redux
// how you mapStateToProps and mapDispatchToProps
export default ({ state, dispatch }: { state: any; dispatch: any }) => {
	const step = 'ports';

	const { isTouched, srcPortId, destPortId } = state.form[step];
	const { errors, srcPorts, destPorts } = state;

	function updateFormValue(key: string, value: string) {
		dispatch(Actions.updateFormValue('ports', key, value));
	}

	return (
		<PortsSelect
			isTouched={isTouched}
			errors={(errors || {})[step]}
			srcPorts={srcPorts}
			destPorts={destPorts}
			srcPortId={srcPortId}
			destPortId={destPortId}
			updateFormValue={updateFormValue}
			loadSrcPort={() => dispatch(Actions.loadSrcPort())}
			loadDestPort={() => dispatch(Actions.loadDestPort())}
		/>
	);
};

const variable = 123;
