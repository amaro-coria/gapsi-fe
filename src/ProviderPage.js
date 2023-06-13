import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { TextField, Button } from '@mui/material';


const PAGE_SIZE = 10; // Number of providers to fetch per page

function ProviderPage() {
  const [providers, setProviders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProviders, setTotalProviders] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    address: '',
  });

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 50,
  });

  useEffect(() => {
    fetchProviders();
  }, [page]);

  const fetchProviders = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`http://localhost:4000/providers?page=${page}`);
      const { providers: fetchedProviders, totalProviders: fetchedTotalProviders } = response.data;

      setProviders((prevProviders) => [...prevProviders, ...fetchedProviders]);
      setTotalProviders(fetchedTotalProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreProviders = () => {
    if (!isLoading && providers.length < totalProviders) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/providers', formData);
      const newProvider = response.data;

      setProviders((prevProviders) => [newProvider, ...prevProviders]);
      setFormData({
        name: '',
        alias: '',
        address: '',
      });
    } catch (error) {
      console.error('Error adding provider:', error);
    }
  };

  const handleDeleteProvider = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/providers/${id}`);
      setProviders((prevProviders) =>
        prevProviders.filter((provider) => provider.id !== id)
      );
    } catch (error) {
      console.error('Error deleting provider:', error);
    }
  };

  const rowRenderer = ({ index, key, parent, style }) => {
    const provider = providers[index];

    return (
     <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key}>
      <div style={style}>
        <h3>{provider.name}</h3>
        <p>Alias: {provider.alias}</p>
        <p>Address: {provider.address}</p>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDeleteProvider(provider.id)}
        >
          Delete Provider
        </Button>
      </div>
    </CellMeasurer>
    );
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <div>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleInputChange}
                placeholder="Alias"
                required
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                required
              />
              <button type="submit">Add Provider</button>
            </form>

            <List
              width={width}
              height={height - 120} // Adjust height to accommodate the form
              rowHeight={cache.rowHeight}
              deferredMeasurementCache={cache}
              rowRenderer={rowRenderer}
              rowCount={providers.length}
              onScroll={loadMoreProviders}
            />
          </div>
        )}
      </AutoSizer>
    </div>
  );
}

export default ProviderPage;
