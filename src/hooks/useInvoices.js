import { useState, useEffect, useCallback } from 'react';
import * as invoiceService from '../services/invoiceService.js';

export function useInvoices() {
  const [invoices, setInvoices] = useState(() => invoiceService.getInitialInvoices());
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(
    () => invoiceService.getInitialInvoices()[0]?.id || null
  );
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [invoiceError, setInvoiceError] = useState(null);

  const addInvoice = useCallback((newInvoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
    setSelectedInvoiceId(newInvoice.id);
  }, []);

  const selectInvoice = useCallback((id) => {
    setSelectedInvoiceId(id);
  }, []);

  const resetToSampleData = useCallback(() => {
    const sample = invoiceService.resetToSampleData();
    setInvoices(sample);
    setSelectedInvoiceId(sample[0]?.id || null);
    setSelectedInvoice(null);
    setInvoiceError(null);
  }, []);

  useEffect(() => {
    if (!selectedInvoiceId) {
      return;
    }

    const controller = new AbortController();
    let isCurrentRequest = true;

    async function loadInvoice() {
      setIsLoadingInvoice(true);
      setInvoiceError(null);

      try {
        const invoice = await invoiceService.getInvoiceById(
          selectedInvoiceId,
          { signal: controller.signal }
        );

        if (isCurrentRequest) {
          setSelectedInvoice(invoice);
        }
      } catch (error) {
        if (error.name !== 'AbortError' && isCurrentRequest) {
          setSelectedInvoice(null);
          setInvoiceError(error);
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoadingInvoice(false);
        }
      }
    }

    loadInvoice();

    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
  }, [selectedInvoiceId]);

  return {
    invoices,
    selectedInvoiceId,
    selectedInvoice,
    isLoadingInvoice,
    invoiceError,
    addInvoice,
    selectInvoice,
    resetToSampleData,
  };
}
