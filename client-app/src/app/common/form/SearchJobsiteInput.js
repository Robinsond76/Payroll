import React from 'react';
import { Jobsites } from '../../api/agent';
import { Search } from 'semantic-ui-react';

const SearchJobsiteInput = () => {
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectionValue, setSelectionValue] = React.useState('');

  //handle selection of search result
  const handleResultSelect = (e, { result }) => setSelectionValue(result.title);

  //jobsite search bar
  const handleSearchChange = async (e, { value }) => {
    setSelectionValue(value);
    setLoading(true);
    let searchResults = await Jobsites.listJobsites(value, 10, 1);
    searchResults = searchResults.data;

    let newResults = [];
    searchResults.forEach((jobsite) => {
      newResults.push({
        title: jobsite.moniker,
        description: `${jobsite.name} - ${jobsite.location.cityTown}`,
      });
    });
    setLoading(false);
    setResults(newResults);
  };

  return (
    <Search
      placeholder='search jobsite...'
      loading={loading}
      onResultSelect={handleResultSelect}
      onSearchChange={handleSearchChange}
      results={results}
      value={selectionValue}
    />
  );
};

export default SearchJobsiteInput;
