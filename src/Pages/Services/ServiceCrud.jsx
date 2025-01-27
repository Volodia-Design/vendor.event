// import Button from "../../components/Button";
// import { InputComponent } from "../../components/InputComponent";
// import useModal from "../../store/useModal";

// export default function ServiceCrud({}) {
//   const {onClose} = useModal();

//   return (
//     <div
//     className="bg-white p-8 px-12 rounded-lg w-[640px] relative animate-fadeIn shadow-lg"
//     onClick={(e) => e.stopPropagation()}
//   >
//     {/* Close button */}
//     <button
//       onClick={onClose}
//       className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-6 w-6"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M6 18L18 6M6 6l12 12"
//         />
//       </svg>
//     </button>

//     {/* Modal header */}
//     <p className="uppercase text-h3 text-primary2-500 mb-6 pr-8 text-center">
//       {isEditMode.id ? "Edit a Service" : "Create a Service"}
//     </p>

//     {/* Form content */}
//     <form className="w-full flex flex-col gap-5">
//       <MultiSelectComponent
//         id="location"
//         label="Location *"
//         options={locations}
//         placeholder="Select Location"
//         className="w-full"
//         value={serviceData.location
//           .split(", ")
//           .filter((id) => id !== "")}
//         onChange={handleLocationChange}
//         error={errors.location}
//       />
//       <div className="flex items-center gap-4">
//         <SelectComponent
//           id="service_type_id"
//           options={serviceTypes}
//           label="Select a Service *"
//           placeholder={
//             <span className="text-black-200">Select Type</span>
//           }
//           className="w-full"
//           value={serviceData.service_type_id}
//           onChange={(value) =>
//             handleDataChange(undefined, "service_type_id", value)
//           }
//           error={errors.service_type_id}
//         />
//         <div className="w-72">
//           <label className="text-text4Medium text-black-400">
//             Price Range *
//           </label>
//           <div className="flex items-center justify-start pl-3 w-full h-[42px] rounded-lg cursor-pointer inputSelectStyle">
//             <p
//               className={`${
//                 calculatePriceRange(serviceData.service_specifications)
//                   .textColor
//               }`}
//             >
//               {
//                 calculatePriceRange(serviceData.service_specifications)
//                   .value
//               }
//             </p>
//           </div>
//           {errors.service_type_id && (
//             <p className="text-red-500 text-text4Medium invisible">a</p>
//           )}
//         </div>
//       </div>

//       {/* Main Service Specification */}
//       <div className="flex items-center gap-4">
//         <InputComponent
//           id="specification-0"
//           label={
//             <div className="flex items-center gap-2">
//               <span>Specification</span>
//               <Info
//                 data-tooltip-id="specificationTooltip"
//                 className="w-5 h-5 text-secondary-800 cursor-pointer"
//               />
//               <Tooltip
//                 id="specificationTooltip"
//                 place="top"
//                 effect="solid"
//               >
//                 Use Specifications if your service contains various
//                 sub-services
//               </Tooltip>
//             </div>
//           }
//           placeholder="Write a specification"
//           className="w-full"
//           value={serviceData.service_specifications[0]?.name || ""}
//           onChange={(value) => handleDataChange(0, "name", value)}
//           error={errors.service_specifications?.[0]?.name}
//         />
//         <div className="w-72 flex items-center gap-2">
//           <InputComponent
//             id="specificationPrice-0"
//             label="Price *"
//             placeholder="Write Price"
//             className="w-full"
//             value={serviceData.service_specifications[0]?.price || ""}
//             onChange={(value) =>
//               handleDataChange(0, "price", Number(value))
//             }
//             isPrice={true}
//             error={errors.service_specifications?.[0]?.price}
//           />
//           <div>
//             <label className="invisible">a</label>
//             <div
//               onClick={handleAddSpecification}
//               className="flex items-center justify-center w-10 h-10 bg-secondary-800 hover:bg-secondary-700 rounded-lg cursor-pointer"
//             >
//               <span className="text-h4 text-white">+</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Additional Specifications */}
//       {serviceData.service_specifications
//         .slice(1)
//         .map((spec, index) => (
//           <div key={index + 1} className="flex items-center gap-4">
//             <InputComponent
//               id={`specification-${index + 1}`}
//               label="Specification"
//               placeholder="Write a specification"
//               className="w-full"
//               value={spec.name}
//               onChange={(value) =>
//                 handleDataChange(index + 1, "name", value)
//               }
//               error={errors.service_specifications?.[index + 1]?.name}
//             />
//             <div className="w-72 flex items-center gap-2">
//               <InputComponent
//                 id={`specificationPrice-${index + 1}`}
//                 label="Price *"
//                 placeholder="Write Price"
//                 className="w-full"
//                 value={spec.price}
//                 onChange={(value) =>
//                   handleDataChange(index + 1, "price", Number(value))
//                 }
//                 isPrice={true}
//                 error={
//                   errors.service_specifications?.[index + 1]?.price
//                 }
//               />
//               <div>
//                 <label className="invisible">a</label>
//                 <div
//                   onClick={() => handleRemoveSpecification(index + 1)}
//                   className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
//                 >
//                   <span className="text-h4 text-white">-</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//       <div className="w-full flex gap-3 items-center justify-end mt-2">
//         <Button
//           text="Cancel"
//           onClick={onClose}
//           buttonStyles="bg-white hover:bg-black-100/30 text-black-300 border border-black-100 py-2 px-6"
//         />
//         <Button
//           text={isEditMode?.id ? "Save" : "Create"}
//           onClick={(e) => saveData(e)}
//           buttonStyles="bg-secondary-800 hover:bg-secondary-700 text-white py-2 px-6"
//         />
//       </div>
//     </form>
//   </div>
//   );
// }



export default function ServiceCrud() {
  return (
    <div>ServiceCrud</div>
  )
}

