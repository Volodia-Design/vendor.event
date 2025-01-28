import { Swiper, SwiperSlide } from "swiper/react";
import Button from "../../components/Button";
import { SelectComponent } from "../../components/SelectComponent";
import { Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import useLoading from "../../store/useLoading";
import ServiceCrud from "./ServiceCrud";
import useModal from "../../store/useModal";
import useCurrentWidth from "../../utils/useCurrentWidth";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const { setIsLoading } = useLoading();
  const [services, setServices] = useState([]);
  const [transformed, setTransformed] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const { onOpen, needToRefetch, setNeedToRefetch } = useModal();
  const { isDesktop } = useCurrentWidth();
  const navigate = useNavigate();
  const getServices = () => {
    setIsLoading(true);
    api
      .get("/vendor-service")
      .then((response) => {
        const transformedData = response.data.data.map((service) => ({
          ...service,
          service_type_id: String(service.service_type_id),
          service_specifications: service.service_specifications.map(
            (spec) => ({
              ...spec,
              price: String(spec.price),
            })
          ),
        }));
        setServices(transformedData);
        const transformedServices = response.data.data.map((service) => ({
          id: service.id,
          location: service.location,
          serviceName: service.service_type.name,
          priceRange:
            service.service_specifications.length > 0
              ? `${Math.min(
                  ...service.service_specifications.map((spec) =>
                    parseFloat(spec.price)
                  )
                )}$ - 
               ${Math.max(
                 ...service.service_specifications.map((spec) =>
                   parseFloat(spec.price)
                 )
               )}$`
              : "N/A",
          specifications: service.service_specifications.map((spec) => ({
            ...spec,
            price: String(spec.price),
          })),
        }));
        setTransformed(transformedServices);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const [serviceData, setServiceData] = useState({
    location: "",
    service_type_id: "",
    service_specifications: [
      {
        name: "",
        price: "",
      },
    ],
  });

  const chunkedSelects = [];
  for (let i = 0; i < services.length; i += 6) {
    chunkedSelects.push(services.slice(i, i + 6));
  }

  const handleCrud = (action) => {
    const props =
      action.type === "create"
        ? { action }
        : { action, editableService: action.data };
    if (isDesktop) {
      onOpen(
        <ServiceCrud {...props} />,
        "!max-w-2xl max-h-[99vh] overflow-auto"
      );
    } else {
      navigate("/service/crud", { state: props });
    }
  };

  useEffect(() => {
    getServices();
    setNeedToRefetch(false);
  }, [needToRefetch]);

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex flex-col items-center justify-between w-full bg-white p-3 rounded-2xl lg:px-6 px-2">
        <div className="flex items-center justify-between w-full">
          <p className="text-text2Medium uppercase">My Services</p>
          <Button
            text="Create a Service"
            buttonStyles="bg-secondary-700 hover:bg-secondary-800 text-white rounded-lg px-4 py-2"
            onClick={() => handleCrud({ type: "create", data: null })}
          />
        </div>
        {/* Swiper Component */}
        <Swiper
          modules={[Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="w-full !pb-10"
        >
          {chunkedSelects.map((chunk, index) => (
            <SwiperSlide key={index}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {chunk.map((service) => {
                  const transformedService = transformed.find(
                    (t) => t.id === service.id
                  );
                  return (
                    <div
                      key={service.id}
                      className="flex gap-2 items-center justify-between w-full"
                    >
                      <SelectComponent
                        id={`select-${service.id}`}
                        placeholder={
                          <div className="flex justify-between w-full px-4">
                            <span>{transformedService?.serviceName}</span>
                            <span>{transformedService?.priceRange}</span>
                          </div>
                        }
                        options={
                          transformedService
                            ? transformedService.specifications.map((spec) => ({
                                id: `${spec.id}`,
                                name: (
                                  <div className="flex justify-between w-full">
                                    <span>{spec.name}</span>
                                    <span>{spec.price}$</span>
                                  </div>
                                ),
                              }))
                            : []
                        }
                        className="w-full"
                        value={selectedServices[service.id] || ""}
                        onChange={(value) => {
                          setSelectedServices((prev) => ({
                            ...prev,
                            [service.id]: value,
                          }));
                        }}
                      />
                      <div
                        className="bg-primary2-50 inputSelectStyle w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() =>
                          handleCrud({ type: "edit", data: service })
                        }
                      >
                        <img
                          src="/Images/ComponentIcons/Edit.svg"
                          alt="edit"
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
