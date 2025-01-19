import { Swiper, SwiperSlide } from "swiper/react";
import Button from "../../components/Button";
import { SelectComponent } from "../../components/SelectComponent";
import { Pagination } from "swiper/modules";

export default function Services() {
  const selects = [
    {
      id: 1,
      options: [
        { id: 1, name: "Photography 100$-1500$" },
        { id: 2, name: "Photography 1500$-2500$" },
        { id: 3, name: "Photography 2500$-3500$" },
      ],
    },
    {
      id: 2,
      options: [
        { id: 1, name: "Videography 100$-1500$" },
        { id: 2, name: "Videography 1500$-2500$" },
        { id: 3, name: "Videography 2500$-3500$" },
      ],
    },
    {
      id: 3,
      options: [
        { id: 1, name: "Photography 100$-1500$" },
        { id: 2, name: "Photography 1500$-2500$" },
        { id: 3, name: "Photography 2500$-3500$" },
      ],
    },
    {
      id: 4,
      options: [
        { id: 1, name: "Videography 100$-1500$" },
        { id: 2, name: "Videography 1500$-2500$" },
        { id: 3, name: "Videography 2500$-3500$" },
      ],
    },
    {
      id: 5,
      options: [
        { id: 1, name: "Photography 100$-1500$" },
        { id: 2, name: "Photography 1500$-2500$" },
        { id: 3, name: "Photography 2500$-3500$" },
      ],
    },
    {
      id: 6,
      options: [
        { id: 1, name: "Videography 100$-1500$" },
        { id: 2, name: "Videography 1500$-2500$" },
        { id: 3, name: "Videography 2500$-3500$" },
      ],
    },
    {
      id: 7,
      options: [
        { id: 1, name: "Photography 100$-1500$" },
        { id: 2, name: "Photography 1500$-2500$" },
        { id: 3, name: "Photography 2500$-3500$" },
      ],
    },
    {
      id: 8,
      options: [
        { id: 1, name: "Videography 100$-1500$" },
        { id: 2, name: "Videography 1500$-2500$" },
        { id: 3, name: "Videography 2500$-3500$" },
      ],
    },
    {
      id: 9,
      options: [
        { id: 1, name: "Photography 100$-1500$" },
        { id: 2, name: "Photography 1500$-2500$" },
        { id: 3, name: "Photography 2500$-3500$" },
      ],
    },
    {
      id: 10,
      options: [
        { id: 1, name: "Videography 100$-1500$" },
        { id: 2, name: "Videography 1500$-2500$" },
        { id: 3, name: "Videography 2500$-3500$" },
      ],
    },
  ];

  // Split the selects array into chunks of 6 items each
  const chunkedSelects = [];
  for (let i = 0; i < selects.length; i += 6) {
    chunkedSelects.push(selects.slice(i, i + 6));
  }

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex flex-col items-center justify-between w-full bg-white p-3 rounded-lg">
        <div className="flex items-center justify-between w-full">
          <p className="text-text3 uppercase">My Services</p>
          <Button
            text="Create a Service"
            buttonStyles="bg-secondary-700 hover:bg-secondary-800 text-white rounded-lg px-4 py-2"
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
              <div className="grid grid-cols-3 gap-4 mt-6">
                {chunk.map((select) => (
                  <div
                    key={select.id}
                    className="flex gap-2 items-center justify-between w-full"
                  >
                    <SelectComponent
                      id={`select-${select.id}`}
                      options={select.options}
                      placeholder="Select a Service"
                      className="w-full"
                      onChange={(value) =>
                        console.log(`Selected value for ${select.id}:`, value)
                      }
                    />
                    <div className="bg-primary2-50 inputSelectStyle w-10 h-10 rounded-full flex items-center justify-center">
                      <img
                        src="/Images/ComponentIcons/Edit.svg"
                        alt="edit"
                        width={24}
                        height={24}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex items-center justify-between w-full bg-white p-3 rounded-lg">
        Table
      </div>
    </div>
  );
}
