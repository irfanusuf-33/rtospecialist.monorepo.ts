import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

interface AlertProps {
  type: string; 
  heading: string;
  body: React.ReactNode | string;
  children?: React.ReactNode;
}

export default function Alert ({type, heading, body}:AlertProps) {

  return (
    <div className={`bg-${type}-50 border border-${type}-200 text-sm text-${type}-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500"`}>
      <div className="flex">
        <WarningAmberRoundedIcon sx={{color: (type === 'yellow' ? '#facc15' : type)}} />
        <div className="ms-4">
          <h3 id="hs-with-description-label" className={`text-sm text-${type}-700 font-semibold`}>
            {heading}
          </h3>
          <div className={`mt-1 text-sm text-${type}-700`}>
            {body}
          </div>
        </div>
      </div>
    </div>
  );
}