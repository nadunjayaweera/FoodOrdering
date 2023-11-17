import * as React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Button, TextField, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";

const useStyles = makeStyles(() => ({
  container: {
    padding: "10px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  imageContainer: {
    border: "1px solid grey",
    borderRadius: "4px",
    padding: "5px",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    maxWidth: "200px",
  },
  formControl: {
    marginBottom: "20px",
    minWidth: 120,
  },
}));

export default function FormAddMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [rowItems, setRowItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemunit, setSelectedItemunit] = useState(null); // Track the selected item
  useEffect(() => {
    // Fetch data from your API when the component mounts
    fetch("http://localhost:8080/api/v1/itemname")
      .then((response) => response.json())
      .then((data) => {
        // Map the data from the API to match the structure of top100Films
        const mappedData = data.map((item) => ({
          label: item.name,
          labelid: item._id,
        }));
        setMenuItems(mappedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleGetRowItem = () => {
    // Fetch row items and map them to match the structure you need
    fetch("http://localhost:8080/api/v1/getallrowitems")
      .then((response) => response.json())
      .then((data) => {
        const mappedRowData = data.map((item) => ({
          label: item.name, // Load the "name" here
          unit: item.productsaleunit, // Set the unit to productsaleunit
        }));
        setRowItems(mappedRowData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  // Function to add a new item to the selected items
  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { name: "", quantity: 0, unit: "" }]);
    handleGetRowItem(); // Call the function here to load "Select Item" data
  };

  const handleSelect = (event, value, index) => {
    if (value) {
      // Extract both label and unit from the selected item
      const selectedLabel = value.label;
      const selectedUnit = value.unit;

      // Update the state with the selected label and unit
      const updatedItems = [...selectedItems];
      updatedItems[index].name = selectedLabel;
      updatedItems[index].unit = selectedUnit;
      setSelectedItems(updatedItems);

      console.log(
        `You selected "${selectedLabel}" with unit "${selectedUnit}"`
      );
    }
  };

  return (
    <div className={useStyles.container}>
      {loading ? (
        "Loading..." // You can add a loading spinner or message here
      ) : (
        <div>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={menuItems}
            sx={{ width: 600 }}
            renderInput={(params) => (
              <TextField {...params} label="Select Menu" />
            )}
          />
          <Button onClick={handleAddItem} style={{ marginBottom: "20px" }}>
            ADD
          </Button>
          {selectedItems.map((item, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <Autocomplete
                disablePortal
                id={`combo-box-item-${index}`}
                options={rowItems}
                getOptionLabel={(option) => option.label}
                sx={{ width: 600 }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Item" />
                )}
                onChange={(event, value) => handleSelect(event, value, index)}
              />
              <div style={{ marginTop: "10px" }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={item.quantity}
                  onChange={(e) => {
                    const updatedItems = [...selectedItems];
                    updatedItems[index].quantity = e.target.value;
                    setSelectedItems(updatedItems);
                  }}
                />
                <TextField label="Unit" value={item.unit} sx={{ width: 100 }} />
              </div>
            </div>
          ))}
          <Button variant="contained">Submit</Button>
        </div>
      )}
    </div>
  );
}
