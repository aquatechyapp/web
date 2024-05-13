import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';
import React from 'react';

export const QuixotePdf = ({ pdfData }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.containerTitle}>
        <Image src="../../public/icon.png" style={styles.logo} />
        <Text style={styles.title}>REPORT OF SERVICES AND PAYMENTS</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.subsContainer}>
          <Text style={styles.subtitle}>
            Technician: <Text>{pdfData.Technician}</Text>
          </Text>
          <Text style={styles.subtitle}>From: {pdfData.From}</Text>
          <Text style={styles.subtitle}>To: {pdfData.To}</Text>
        </View>

        <View style={styles.subsContainer}>
          <Text style={styles.subtitle}>Total services made</Text>
          <Text style={styles.subtitle}>{pdfData.TotalServicesMade}</Text>
          <Text style={styles.subtitle}>Total to be paid</Text>
          <Text style={styles.subtitle}>US$0.00</Text>
        </View>
      </View>

      {/* Seção direita com informações sobre os serviços */}
      <View style={styles.rightSection}>
        <Text style={styles.rightTitle}>Services Information</Text>
        {/* Mapeie os dados e crie uma tabela para cada dia da semana */}
        {pdfData &&
          pdfData.ServicesByWeekday &&
          pdfData.ServicesByWeekday.map((services, index) => (
            <View key={index} style={styles.dayContainer}>
              <Text style={styles.dayTitle}>{getWeekdayName(index)}</Text>
              <Text style={styles.dayTitle}>({services.length})</Text>
              {/* Adicione a tabela aqui */}
              <View style={styles.table}>
                {/* Cabeçalho da tabela */}
                <View style={styles.row}>
                  <Text style={styles.headerCell}>Pool</Text>
                  <Text style={styles.headerCell}>Date</Text>
                  <Text style={styles.headerCell}>Chemicals Spent</Text>
                  <Text style={styles.headerCell}>Paid</Text>
                </View>
                {/* Preencha as células da tabela com os dados do serviço */}
                {services && services.length > 0 ? (
                  services.map((service, serviceIndex) => (
                    <View key={serviceIndex} style={styles.row}>
                      <Text style={styles.cell}>{service.pool.name}</Text>
                      <Text style={styles.cell}>
                        {format(new Date(service.createdAt), "iiii, MMMM do 'at' h:mm aaaa")}
                      </Text>
                      <Text style={styles.cell}>{service.chemicalsSpent}</Text>
                      <Text style={styles.cell}>US$0.00</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.row}>
                    <Text style={styles.cell}>No services made</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
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
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20
  },
  containerTitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftSection: {
    width: '100%'
  },
  rightSection: {
    width: '100%'
  },
  logo: {
    width: 100,
    height: 100
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginVertical: 10,
    color: 'black'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold'
  },
  rightTitle: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10
  },
  dayContainer: {
    marginTop: 20
  },
  dayTitle: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold'
  },
  table: {
    width: '100%',
    borderTopWidth: 2,
    borderTopColor: '#4040F2'
  },
  headerCell: {
    color: 'black',
    padding: 5,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
    fontSize: 15
  },
  row: {
    flexDirection: 'row',
    width: '100%'
  },
  cell: {
    padding: 5,
    flex: 1,
    fontSize: 13,
    fontFamily: 'Helvetica-Bold'
  }
});
