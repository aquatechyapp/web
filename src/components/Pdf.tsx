import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

export const QuixotePdf = ({ pdfData }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Service Report</Text>
        <Text style={styles.subtitle}>Technician: {pdfData.Technician}</Text>
        <Text style={styles.subtitle}>From: {pdfData.From}</Text>
        <Text style={styles.subtitle}>To: {pdfData.To}</Text>
        <Text style={styles.subtitle}>Total Services Made: {pdfData.TotalServicesMade}</Text>
        <View style={styles.serviceList}>
          {pdfData &&
            pdfData.ServicesByWeekday &&
            pdfData.ServicesByWeekday.map((services, index) => (
              <View key={index} style={styles.serviceDay}>
                <Text style={styles.dayTitle}>{getWeekdayName(index)}</Text>
                {services && services.length > 0 ? (
                  services.map((service) => (
                    <View key={service.id} style={styles.serviceItem}>
                      <Text>Service ID: {service.id}</Text>
                      <Text>Done by: {service.doneByUser.name}</Text>
                      <Text>Acid Spent: {service.acidSpent}</Text>
                      <Text>Alkalinity: {service.alkalinity}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noServices}>No services made</Text>
                )}
              </View>
            ))}
        </View>
      </View>
    </Page>
  </Document>
);

// Função para obter o nome do dia da semana
const getWeekdayName = (index) => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return weekdays[index];
};

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    width: '100%',
    height: '100%'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5
  },
  serviceList: {
    marginTop: 20
  },
  serviceDay: {
    marginBottom: 15
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  noServices: {
    fontStyle: 'italic'
  },
  serviceItem: {
    marginLeft: 10,
    marginTop: 5
  }
});
