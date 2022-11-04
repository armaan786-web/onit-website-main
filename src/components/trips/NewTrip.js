import { today } from "../../common/today";
import Item from "./TripItem";
import CustomCard from "../../utils/custom-card";
import { Button } from "antd-mobile";
import { useState } from "react";
import { tripsNew } from "../../data";
import NoTrip from "./NoTrip";
import { FaLongArrowAltRight } from "react-icons/fa";

const Upcoming = ({ }) => {
  const [data, setData] = useState(tripsNew || []);

  return (
    <div>
      {allTripsList.length > 0 ? (
        <div style={{ padding: "1rem" }}>

          <CustomCard style={{ padding: "0 1rem" }}>
            {allTripsList.map((item, i) => (
              <Item index={i} length={allTripsList.length} item={item} />
            ))}
          </CustomCard>
        </div>
      ) : (
        <NoTrip />
      )}
    </div>
  );
};

export default Upcoming;
