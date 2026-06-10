"use client";

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useState } from "react";
import { usePageLoaderStore } from "../../../state/usePageLoaderStore";
import { useGlobalToastStore } from "../../../state/useGlobalToastStore";
import { useAccountsStore } from "../../../state/useAccountsStore";
import { useRouter } from 'next/navigation';
import URLUtils from "../../../scripts/UrlUtils";

interface PdevModalProps {
    open: boolean;
    handleOpen: () => void;
}

export default function PdevModal ({ open, handleOpen }: PdevModalProps) {
    const [estimatedStaff, setEstimatedStaff] = useState("");
    const [error, setError] = useState<string>("");
    const setLoading = usePageLoaderStore((state) => state.setLoading);
    const setToastState = useGlobalToastStore((state) => state.setToastState);
    const customer = useAccountsStore((state) => state.customer);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEstimatedStaff(e.target.value);
        setError( "" );
    };
    
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
       if ( estimatedStaff.trim().length === 0 || isNaN(Number(estimatedStaff)) || Number(estimatedStaff) <= 0 || estimatedStaff.length > 11) {
       setError(
       estimatedStaff.trim().length === 0 ? "Staff count cannot be empty." : isNaN(Number(estimatedStaff)) 
       ? "Enter a valid number." : Number(estimatedStaff) <= 0 ? "Staff count must be greater than 0."
       : "Staff count cannot exceed 11 digits.");}
        else {
            try {
                if(!customer.isAuthenticated){
                    router.replace('/user/login');
                    setToastState({ html: "you need to signin to perform this action!", show: true });
                    return;
                  }
                setLoading(true);
                
                const res = await URLUtils.post('HelpAndSupport-MembQuery', {form: estimatedStaff, group: (e.target as HTMLButtonElement).dataset.id});
                if (res.status === 200) {
                    setEstimatedStaff("");
                    setError("");
                    handleOpen();
                }
            } catch {
                setToastState({html: "Submission failed",show: true});
                return;
            }
            finally{
                setLoading(false);
            }
        }
    };

    return (
        <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="modal-content box-border relative bg-white rounded-md shadow-lg">
                    <button onClick={handleOpen} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
                        <CloseOutlinedIcon />
                    </button>
                    <p className="text-base font-medium text-red-700 px-6 my-4">Additional info</p>
                    <div className="h-[1px] bg-gray-200 mb-4"></div>
                    <p className="text-xs font-base text-black mb-6 px-6">Please enter the number of staff members:</p>
                    <div className="mx-6">
                        <input
                            value={estimatedStaff}
                            onChange={handleInputChange}
                            type="text"
                            className="text-xs border border-gray-400 rounded-md w-80 px-4 py-2 focus:outline-none"
                            placeholder="Estimated no of staff members"
                        />
                        {error && (
                            <p className="text-xs text-red-500">{error}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 m-6 mt-8">
                        <button
                            type="button"
                            className="text-sm font-medium mr-2 px-4 py-4 bg-gray-300 text-gray-700 rounded-md uppercase"
                            onClick={handleOpen}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            data-id="PRO_DEV"
                            className="text-sm font-medium px-4 py-4 bg-red-600 text-white rounded-md uppercase"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
