/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

const EmptyCard = ({message}) => {
  return (
<div className="text-center bg-white text-xl rounded-lg shadow-md p-6 max-w-md mx-auto mt-60">
    <div className=" opacity-50">{message}
    </div>
    </div>
  )
}

export default EmptyCard