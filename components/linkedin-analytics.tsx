'use client'

import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { FileUpload } from './components/file-upload'
import { KeywordSearch } from './components/keyword-search'
import { ImpressionsChart } from './components/impressions-chart'
import { EngagementChart } from './components/engagement-chart'
import { EngagementRateChart } from './components/engagement-rate-chart'
import { Scorecards } from './components/scorecards'
import { DateRangeSlider } from './components/date-range-slider'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

export default function LinkedInAnalytics() {
  const [data, setData] = useState<any[]>([])
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [comparisonDays, setComparisonDays] = useState(30)
  const [maxDays, setMaxDays] = useState(0)

  const processData = (rawData: any[]) => {
    try {
      console.log('Raw data:', rawData.slice(0, 5)); // Log first 5 rows of raw data

      if (!Array.isArray(rawData) || rawData.length === 0) {
        throw new Error('Invalid or empty data received');
      }

      // Find the index of the row containing column headers
      const headerIndex = rawData.findIndex(row => row.includes('Date'));
      if (headerIndex === -1) {
        throw new Error('Could not find header row');
      }

      // Extract headers and data
      const headers = rawData[headerIndex];
      const dataRows = rawData.slice(headerIndex + 1);

      const processedData = dataRows.map((row, index) => {
        const rowData: { [key: string]: any } = {};
        headers.forEach((header: string, i: number) => {
          rowData[header] = row[i];
        });

        if (!rowData['Date'] || !rowData['Impressions (organic)'] || !rowData['Reactions (organic)'] || !rowData['Comments (organic)'] || !rowData['Reposts (organic)'] || !rowData['Engagement rate (organic)']) {
          console.error(`Missing required fields in row ${index + 1}:`, rowData);
          return null;
        }

        const date = parseDate(rowData['Date']);
        if (isNaN(date.getTime())) {
          console.error(`Invalid date in row ${index + 1}:`, rowData['Date']);
          return null;
        }

        return {
          date,
          impressions: parseInt(rowData['Impressions (organic)'], 10),
          reactions: parseInt(rowData['Reactions (organic)'], 10),
          comments: parseInt(rowData['Comments (organic)'], 10),
          shares: parseInt(rowData['Reposts (organic)'], 10),
          engagementRate: parseFloat(rowData['Engagement rate (organic)']) * 100,
        };
      }).filter(row => row !== null);

      if (processedData.length === 0) {
        throw new Error('No valid data found in the file');
      }

      console.log('Processed data:', processedData.slice(0, 5)); // Log first 5 rows of processed data

      processedData.sort((a, b) => a.date.getTime() - b.date.getTime());

      const maxDays = processedData.length;
      setMaxDays(maxDays);
      setComparisonDays(Math.min(30, Math.floor(maxDays / 2)));

      return processedData;
    } catch (error) {
      console.error('Error processing data:', error);
      throw new Error('Failed to process data. Please check the file format and try again.');
    }
  };

  const parseDate = (dateString: string) => {
    const [month, day, year] = dateString.split('/');
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('File upload started:', file.name);
      const arrayBuffer = await file.arrayBuffer();
      console.log('File converted to array buffer');
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      console.log('Workbook read successfully');
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, dateNF: 'mm/dd/yyyy' });
      console.log('Raw data extracted:', rawData.length, 'rows');
      if (rawData.length === 0) {
        throw new Error('The uploaded file is empty');
      }
      const processedData = processData(rawData);
      console.log('Data processed successfully:', processedData.length, 'rows');
      setData(processedData);
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchKeyword: string) => {
    setKeyword(searchKeyword);
  };

  const handleComparisonDaysChange = (days: number) => {
    setComparisonDays(days);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">LinkedIn Analytics Visualizer</h1>
      <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {data.length > 0 && (
        <>
          <Scorecards data={data} comparisonDays={comparisonDays} />
          <DateRangeSlider
            maxDays={maxDays}
            comparisonDays={comparisonDays}
            onComparisonDaysChange={handleComparisonDaysChange}
          />
          <KeywordSearch onSearch={handleSearch} />
          <ImpressionsChart data={data} keyword={keyword} />
          <EngagementChart data={data} keyword={keyword} />
          <EngagementRateChart data={data} keyword={keyword} />
        </>
      )}
    </div>
  );
}

