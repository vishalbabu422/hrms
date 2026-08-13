import { useEffect, useReducer } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { initialState } from "./reducer/initialState";
import { formReducer } from "./reducer/formReducer";

import Stepper from "./components/Stepper";

import SkillsStep from "./steps/SkillsStep";
import HealthStep from "./steps/HealthStep";
import VehicleStep from "./steps/VehicleStep";
import HobbiesStep from "./steps/HobbiesStep";
import AchievementsStep from "./steps/AchievementsStep";
import AssetsStep from "./steps/AssetsStep";
import LanguagesStep from "./steps/LanguagesStep";
import PassportStep from "./steps/PassportStep";
import DisciplineStep from "./steps/DisciplineStep";
import ExamStep from "./steps/ExamStep";
import TrainingStep from "./steps/TrainingStep";

const MoreDetails = () => {

    const { employeeId: routeEmployeeId } = useParams();
    const location = useLocation();
    const auth = useSelector((state) => state.auth);
    const loggedInEmployeeId = auth?.user?.employee_id || auth?.employee_id || auth?.user?.id;
    const employeeId = routeEmployeeId || loggedInEmployeeId;

    const [state, dispatch] = useReducer(formReducer, initialState);

    useEffect(() => {
        const tab = location.state?.sideTab;
        const stepMap = {
            skills: 0,
            health: 1,
            vehicle: 2,
            hobbies: 3,
            achievements: 4,
            assets: 5,
            languages: 6,
            passport: 7,
            discipline: 8,
            exam: 9,
            training: 10,
        };

        if (tab && stepMap[tab] !== undefined) {
            dispatch({ type: 'SET_STEP', payload: stepMap[tab] });
        }
    }, [location.state]);

    const renderStep = () => {

        switch (state.step) {

            case 0:
                return <SkillsStep state={state} dispatch={dispatch} employeeId={employeeId} />;

            case 1:
                return <HealthStep state={state} dispatch={dispatch} employeeId={employeeId} />;

            case 2:
                return <VehicleStep state={state} dispatch={dispatch} employeeId={employeeId} />;

            case 3:
                return <HobbiesStep state={state} dispatch={dispatch} employeeId={employeeId} />;

            case 4:
                return <AchievementsStep state={state} dispatch={dispatch} employeeId={employeeId} />;

            case 5:
                return <AssetsStep state={state} dispatch={dispatch} employeeId={employeeId} />;

            case 6:
                return <LanguagesStep state={state} dispatch={dispatch} employeeId={employeeId} />;

            case 7:
                return <PassportStep state={state} dispatch={dispatch} employeeId={employeeId} />;

            case 8:
                return <DisciplineStep state={state} dispatch={dispatch} employeeId={employeeId} />;

            case 9:
                return <ExamStep state={state} dispatch={dispatch} employeeId={employeeId} />;

            case 10:
                return <TrainingStep state={state} dispatch={dispatch} employeeId={employeeId} />;

            default:
                return null;
        }
    };

    return (

        <div className="card p-4 shadow-sm mb-4" style={{ minHeight: '800px' }}>
            <h4 className="mb-2">
                Employee Additional Details
            </h4>

            <Stepper step={state.step} dispatch={dispatch} />

            {renderStep()}

        </div>

    );
};

export default MoreDetails;