import CIcon from '@coreui/icons-react'
import { stepConfig } from "../config/stepConfig";

const Stepper = ({ step, dispatch }) => {

    return (
        <div className="stepper-underline mb-4">
            {stepConfig.map((s, index) => (
                <div
                    key={index}
                    color={step === index ? "primary" : "light"}
                    className={`stepper-item ${step === index ? 'active' : ''}`}
                    onClick={() =>
                        dispatch({
                            type: "SET_STEP",
                            payload: index
                        })
                    }
                >
                    <CIcon icon={s.icon} />
                    <span>{s.label}</span>
                </div>
            ))}
        </div>
    );
};

export default Stepper;