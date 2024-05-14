import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';
import React from 'react';

export const QuixotePdf = ({ pdfData }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.containerTitle}>
        <Image src="../../public/logotransparente.jpg" style={styles.logo} />
        <Text style={styles.title}>REPORT OF SERVICES AND PAYMENTS</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.subContainerStart}>
          <Text style={styles.subtitle}>
            Technician: <Text style={{ fontSize: 12 }}>{pdfData.Technician}</Text>
          </Text>
          <Text style={styles.subtitle}>
            From: <Text style={{ fontSize: 12 }}>{pdfData.From}</Text>
          </Text>
          <Text style={styles.subtitle}>
            To: <Text style={{ fontSize: 12 }}>{pdfData.To}</Text>
          </Text>
        </View>

        <View style={styles.subsContainerEnd}>
          <Text style={{ fontSize: 12 }}>Total services made</Text>
          <Text style={{ fontSize: 20 }}>{pdfData.TotalServicesMade} services</Text>
          <Text style={{ fontSize: 12 }}>Total to be paid</Text>
          <Text style={{ fontSize: 20 }}>US$0.00</Text>
        </View>
      </View>

      {/* Seção direita com informações sobre os serviços */}
      <View style={styles.rightSection}>
        {pdfData &&
          pdfData.ServicesByWeekday &&
          pdfData.ServicesByWeekday.map((services, index) => (
            <View key={index} style={styles.dayContainer}>
              {services && services.length > 0 ? (
                <View>
                  <View style={styles.row}>
                    <Text style={styles.dayTitle}>{getWeekdayName(index)}</Text>
                    <Text style={{ fontSize: 12, marginRight: 5 }}>({services.length} services)</Text>
                  </View>
                  <View style={styles.table}>
                    <View style={styles.row}>
                      <Text style={[styles.headerCell, { flex: 2, textAlign: 'flex-start' }]}>Pool</Text>
                      <Text style={[styles.headerCell, { flex: 2, textAlign: 'center' }]}>Date</Text>
                      <Text style={[styles.headerCell, { flex: 3, textAlign: 'center' }]}>Chemicals Spent</Text>
                      <Text style={[styles.headerCell, { flex: 1, textAlign: 'right' }]}>Paid</Text>
                    </View>

                    {services.map((service, serviceIndex) => (
                      <View key={serviceIndex} style={styles.row}>
                        <Text style={[styles.cell, { flex: 2, textAlign: 'flex-start' }]}>{service.pool.name}</Text>
                        <Text style={[styles.cell, { flex: 2, textAlign: 'center' }]}>
                          {format(new Date(service.createdAt), "iiii, MMMM do 'at' h:mm aaaa")}
                        </Text>
                        <Text style={[styles.cell, { flex: 3, textAlign: 'center' }]}>
                          {service.acidSpent} - {service.chlorineSpent} - {service.saltSpent} - {'\n'}
                          {service.tabletSpent} - {service.shockSpent} - {service.phosphateSpent}
                        </Text>
                        <Text style={[styles.cell, { flex: 1, textAlign: 'right' }]}>US$0.00</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          ))}
      </View>
    </Page>
  </Document>
);

// Font.register({
//   family: 'GeneralSans',
//   src: '/public/fonts/GeneralSans-Bold.woff2'
// });

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
    padding: 10
  },
  containerTitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subContainerStart: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  subsContainerEnd: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    color: 'black'
    // fontFamily: 'GeneralSans-Bold'
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 5
  },
  rightTitle: {
    fontSize: 15,
    marginBottom: 10
  },
  dayContainer: {
    marginTop: 20
  },
  dayTitle: {
    fontSize: 15,
    color: 'black'
  },
  table: {
    width: '100%',
    borderTopWidth: 2,
    borderTopColor: '#4040F2',
    paddingVertical: 2
  },
  headerCell: {
    width: '100%',
    color: 'black',
    alignItems: 'center',
    fontSize: 15,
    marginVertical: 5,
    flex: 1
  },
  row: {
    flexDirection: 'row',
    width: '100%'
  },
  cell: {
    width: '100%',
    fontSize: 11,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 5,
    flex: 1
  }
});
