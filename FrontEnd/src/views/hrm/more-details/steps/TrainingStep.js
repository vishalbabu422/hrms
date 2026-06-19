import {
    CButton,
    CFormInput,
    CFormSelect,
    CFormTextarea
} from "@coreui/react";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import {
    getEmployeeTrainings,
    createEmployeeTraining,
    updateEmployeeTraining
} from "../../../../services/employeeTrainings";

import useDocumentUpload from "../../../../hooks/useDocumentUpload";

import { validateTraining } from "../../../../validations/trainingValidation";

const TrainingStep = ({ state, dispatch, employeeId }) => {

    const { trainings } = state;
    const { uploadDocument, uploading } = useDocumentUpload(employeeId);
    const [errors, setErrors] = useState({});

    useEffect(() => {

        const loadTrainings = async () => {
            try {

                const res = await getEmployeeTrainings(employeeId);

                // ✅ Case 1: Data exists
                if (res.data?.status === "success" && res.data.data?.length) {

                    dispatch({
                        type: "SET_TRAININGS",
                        payload: res.data.data
                    });

                }
                // ✅ Case 2: No data → create empty row
                else {

                    dispatch({
                        type: "SET_TRAININGS",
                        payload: state.trainings
                    });

                }

            } catch (err) {

                console.error(err);

                // ✅ Fallback safety
                dispatch({
                    type: "SET_TRAININGS",
                    payload: state.trainings
                });

            }
        };

        loadTrainings();

    }, [employeeId]);


    const validateTrainings = () => {

        const newErrors = {};

        trainings.forEach((training, index) => {

            const errors = validateTraining(training);

            if (Object.keys(errors).length) {
                newErrors[index] = errors;
            }

        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    const saveTraining = async (training) => {
        const res = await createEmployeeTraining(employeeId, {
            training_name: training.training_name,
            training_provider: training.training_provider,
            training_start_date: training.training_start_date,
            training_end_date: training.training_end_date,
            training_type: training.training_type,
            description: training.description
        });

        const trainingId = res.data.data.id;

        if (training.certificate_file instanceof File) {

            try {

                await uploadDocument({
                    file: training.certificate_file,
                    docType: "TRAINING_CERT",
                    trainingId: trainingId,
                    remarks: "Training Certificate"
                });

            } catch (err) {
                console.error("Upload failed:", err);
                toast.error('Upload failed');
            }

        }

    };

    const updateTraining = async (training) => {

        await updateEmployeeTraining(employeeId, training.id, {
            training_name: training.training_name,
            training_provider: training.training_provider,
            training_start_date: training.training_start_date,
            training_end_date: training.training_end_date,
            training_type: training.training_type,
            description: training.description
        });

        if (training.certificate_file instanceof File) {
            try {
                await uploadDocument({
                    file: training.certificate_file,
                    docType: "TRAINING_CERT",
                    trainingId: training.id,
                    remarks: "Training Certificate"
                });
            } catch (err) {
                console.error("Upload failed:", err);
                toast.error('Upload failed');
            }
        }
    };

    const handleSave = async (training) => {
        try {

            if (training.id) {
                return await updateTraining(training);
            } else {
                return await saveTraining(training);
            }

        } catch (err) {
            console.error("Save failed:", err);
            throw err; // VERY IMPORTANT
        }
    };

    const handleNext = async () => {

        const isValid = validateTrainings();
        if (!isValid) {
            toast.error("Please fix validation errors");
            return;
        }

        try {

            for (const training of state.trainings) {
                await handleSave(training);
            }

            toast.success('Training saved!');
        } catch (err) {
            console.error("Error saving trainings:", err);
            toast.error('Failed to save training. Please try again.');
        }

    };

    return (
        <div className="step-content">

            <h5 className="mb-3">Training</h5>

            {trainings.map((training, index) => (

                <div key={index} className="border rounded p-3 mb-3">

                    <div className="row g-3">

                        <div className="col-md-6">
                            <CFormInput
                                label={
                                    <>
                                        Training Name <span className="text-danger">*</span>
                                    </>
                                }
                                value={training.training_name}
                                invalid={!!errors[index]?.training_name}
                                feedback={errors[index]?.training_name}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "trainings",
                                        index,
                                        field: "training_name",
                                        value: e.target.value
                                    })
                                }
                            />
                        </div>


                        <div className="col-md-6">
                            <CFormInput
                                label="Training Provider"
                                value={training.training_provider}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "trainings",
                                        index,
                                        field: "training_provider",
                                        value: e.target.value
                                    })
                                }
                            />
                        </div>


                        <div className="col-md-6">
                            <CFormInput
                                type="date"
                                label={
                                    <>
                                        Training Start Date <span className="text-danger">*</span>
                                    </>
                                }
                                value={training.training_start_date}
                                invalid={!!errors[index]?.training_start_date}
                                feedback={errors[index]?.training_start_date}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "trainings",
                                        index,
                                        field: "training_start_date",
                                        value: e.target.value
                                    })
                                }
                            />
                        </div>


                        <div className="col-md-6">
                            <CFormInput
                                type="date"
                                label={
                                    <>
                                        Training End Date <span className="text-danger">*</span>
                                    </>
                                }
                                value={training.training_end_date}
                                invalid={!!errors[index]?.training_end_date}
                                feedback={errors[index]?.training_end_date}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "trainings",
                                        index,
                                        field: "training_end_date",
                                        value: e.target.value
                                    })
                                }
                            />
                        </div>


                        <div className="col-md-6">
                            <CFormSelect
                                label={
                                    <>
                                        Training Type <span className="text-danger">*</span>
                                    </>
                                }
                                value={training.training_type}
                                invalid={!!errors[index]?.training_type}
                                feedback={errors[index]?.training_type}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "trainings",
                                        index,
                                        field: "training_type",
                                        value: e.target.value
                                    })
                                }
                            >
                                <option value="">Select Training Type</option>
                                <option value="SELF">SELF</option>
                                <option value="COMPANY">COMPANY</option>
                            </CFormSelect>
                        </div>


                        <div className="col-md-6">
                            <CFormInput
                                type="file"
                                label="Training Certificate"
                                invalid={!!errors[index]?.certificate_file}
                                feedback={errors[index]?.certificate_file}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "trainings",
                                        index,
                                        field: "certificate_file",
                                        value: e.target.files[0]
                                    })
                                }
                            />

                            {(training.certificate_file || training.certificate_uploaded) && (
                                <small className="text-success">
                                    {training.certificate_file instanceof File
                                        ? "New certificate selected"
                                        : "Certificate already uploaded"}
                                </small>
                            )}
                        </div>


                        <div className="col-md-12">
                            <CFormTextarea
                                label="Description"
                                value={training.description}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_ITEM",
                                        section: "trainings",
                                        index,
                                        field: "description",
                                        value: e.target.value
                                    })
                                }
                            />
                        </div>

                    </div>


                    {trainings.length > 1 && (
                        <div className="text-end mt-2">
                            <CButton
                                color="danger"
                                size="sm"
                                onClick={() =>
                                    dispatch({
                                        type: "REMOVE_ITEM",
                                        section: "trainings",
                                        index
                                    })
                                }
                            >
                                Remove
                            </CButton>
                        </div>
                    )}

                </div>

            ))}


            <CButton
                className="btn btn-outline-primary"
                onClick={() =>
                    dispatch({
                        type: "ADD_ITEM",
                        section: "trainings",
                        payload: {
                            training_name: "",
                            training_provider: "",
                            training_start_date: "",
                            training_end_date: "",
                            certificate_file: "",
                            training_type: "SELF",
                            description: ""
                        }
                    })
                }
            >
                + Add Training
            </CButton>


            <div className="d-flex justify-content-end gap-2 mt-4">

                <CButton
                    className="btn btn-outline-secondary"
                    color="light"
                    disabled={state.step === 0}
                    onClick={() =>
                        dispatch({
                            type: "SET_STEP",
                            payload: state.step - 1
                        })
                    }
                >
                    Previous
                </CButton>

                <CButton color="primary" onClick={handleNext} disabled={uploading}>
                    {uploading ? "Uploading..." : "Save & Finish"}
                </CButton>

            </div>

        </div>
    );
};

export default TrainingStep;