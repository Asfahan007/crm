import { openDatabase } from 'react-native-sqlite-storage'

const db = openDatabase({
  name: 'customer_database',
})

export const createDatabaseAndTables = () => {
  db.transaction(txn => {
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS sale (mobileSaleId varchar(255) PRIMARY KEY,saleId varchar(255), customerId varchar(255),mobileCustomerId varchar(255),customerName varchar(255),customerMobile varchar(255),customerEmail varchar(255),invoiceNo varchar(255),category varchar(255),invoiceDate varchar(255),subTotal varchar(255),taxPercentage varchar(255),totalTax varchar(255),total varchar(255),paymentMethod varchar(255),status varchar(255),notes varchar(255),storeId varchar(255),mobileStoreId varchar(255),storeName varchar(255),accountId varchar(255),createdBy varchar(255),updatedBy varchar(255),createdDate varchar(255),updatedDate varchar(255),type varchar(255),discountedPrice varchar(255),discountedPercentage varchar(255),offer varchar(255),sub varchar(255),paymentType varchar(255),fullpaymentType varchar(255),paylaterType varchar(255),isOnline varchar(255))',
      [],
      () => {
        console.log(' SALE TABLE CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS sale_item (mobileSaleItemId varchar(255) PRIMARY KEY, saleItemId varchar(255), productId varchar(255),productName varchar(255),category varchar(255),subCategory varchar(255),sizing varchar(255),mrp varchar(255),qty varchar(255),quantityPostReturn varchar(255),sku varchar(255),total varchar(255),storeId varchar(255),mobileStoreId varchar(255),accountId varchar(255),mobileAccountId varchar(255),saleId varchar(255),mobileSaleId varchar(255),createdBy varchar(255),updatedBy varchar(255),createdDate varchar(255),updatedDate varchar(255),type varchar(255),productInventoryId varchar(255),mobileProductInventoryId varchar(255), isOnline varchar(255))',
      [],
      () => {
        console.log('saleitem TABLE CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )

    //all_deal table modified
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS All_Deal (mobileDealId VARCHAR(255) PRIMARY KEY,dealId varchar(255) UNIQUE,dealDate varchar(255),companyId varchar(255),wonReason varchar(250),annualContractValue varchar(250),updatedDate varchar(250),pipeline varchar(250),nextStep varchar(250),closeDate varchar(250),dealType varchar(250),noOfTimesContacted varchar(250),noOfSalesActiviy varchar(250),sourceType varchar(250),forecastAmount varchar(250),mediumOfLastMeeting varchar(250),createdDate varchar(250),lostReason varchar(250),annualReccuringRevenue varchar(250),dealOwner varchar(250),lastActivityDate varchar(250),nextActivityDate varchar(250),ownerAssignedDate varchar(250),dealStage varchar(250),dealStatus varchar(250),createdbyUser varchar(250),noOfAssociatedContacts varchar(250),amount varchar(250),totalContractValue varchar(250),probability varchar(250),dealName varchar(255),dealAmount varchar(250),priority varchar(250),monthlyRecurringRevenue varchar(250),dealDescription varchar(250),amountInCompanyCurrency varchar(250),associatedCompanyId varchar(250),associatedCompany varchar(250),associatedContactId varchar(250),associatedContact varchar(250),hierarchyId varchar(255),dealAccounts varchar(1000),dealContact varchar(1000),dealProduct varchar(1000),dealDetail varchar(1000),isOnline varchar(255))',
      [],
      () => {
        console.log('All_Deal TABLE  CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    //Deal Details

    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS DealDetails_info (id INTEGER PRIMARY KEY AUTOINCREMENT,dealId varchar(255),initiationDate varchar(255),calendarYearofStart varchar(255),qtr varchar(255),companyCommercialLead varchar(255),nominatedCompanyLead varchar(255),mainStatus varchar(255),market varchar(255),originofEnquiry varchar(255),internalProgRef varchar(255),regionEngineering varchar(255),region_Manufacture varchar(255),customer varchar(255),oEM varchar(255),visitedITL varchar(255),clientLead varchar(255),clientEmail varchar(255),platform varchar(255),genre varchar(255),programmeName varchar(255),infoLinks varchar(255),partConsolidation varchar(255),weightReduction varchar(255),springbackAndDimeCompanyBDonalTolerance varchar(255),materialStrength varchar(255),ductilityCrashProperties varchar(255),formabilityDesignRadii varchar(255),pieceCostReduction varchar(255),capexToolingSaving varchar(255),recycledMaterialCircularity varchar(255),materialbeingreplaced varchar(255),competitorifknown varchar(255),noofPartsBaseline varchar(255),noofPartsUpperPotential varchar(255),partFormingComplexity varchar(255),partManufacturingComplexity varchar(255),partTypes_GeneralDescriptions varchar(255),upperStructure varchar(255),closures varchar(255),batteryChargerBox varchar(255),seats varchar(255),chassis varchar(255),wingFairingStructures varchar(255),nacelleEngineCoverLipSkin varchar(255),Other varchar(255),autoBoltOns varchar(255),materialGroup varchar(255),specificGrade varchar(255),thickness varchar(255),hDQ_D varchar(255),tWR varchar(255),recyclePotential varchar(255),alloyInfluencer varchar(255),materialSupplier varchar(255),runningChangepotential varchar(255),sOPYear varchar(255),sOaMonth varchar(255),peakVolumesLowerBaselinek varchar(255),peakVolumesUpperk varchar(255),estLifetimeVolumes varchar(255),sourcingDecisionTiming varchar(255),estValueperSet varchar(255),lowerEstTierTurnover varchar(255),upperEstTierTurnover varchar(255),incomeEst varchar(255),royalty varchar(255),lowerRoyaltyEM varchar(255),lowerEstRoyaltyEM varchar(255), chance varchar(255),avgPartValue varchar(255),engineeringServicesaotn varchar(255),tooling varchar(255),potentialChannelPartner varchar(255),progressLevel varchar(255),dateofLastClientContact varchar(255),reasonForLossorLapse varchar(255),whatWouldHaveMadeItBetter varchar(255),strategiBRaPkiPg varchar(255),engServicesPotential varchar(255),dealDetailId varchar(255))',
      [],
      () => {
        console.log('TABLE CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    //deal_account table modified

    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS store_info (mobileStoreId VARCHAR(255) PRIMARY KEY,storeId varchar(255) UNIQUE,storeName varchar(255),storeDescription varchar(255),addressLine1 varchar(255),addressLine2 varchar(255),city varchar(255),state varchar(255),zipCode varchar(255),storeEmail varchar(255),storePhone varchar(255),storeContactName varchar(255),storeContactMobile varchar(255),storeContactMobile2 varchar(255),storeStatus varchar(255),storeCashBalance varchar(255),createdBy varchar(255),updatedBy varchar(255),createdDate varchar(255),updatedDate varchar(255),serviceTax varchar(255),logo varchar(255),accountId varchar(255),territoryId varchar(255),mobileTerritoryId varchar(255),syncTime varchar(255),cache varchar(255),lastSyncTime varchar(255),companyId VARCHAR(255),isOnline varchar(255))',
      [],
      () => {
        console.log('STORE TABLE CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    //all_deal table modified
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS All_Deal (mobileDealId VARCHAR(255) PRIMARY KEY,dealId varchar(255) UNIQUE,dealDate varchar(255),companyId varchar(255),wonReason varchar(250),annualContractValue varchar(250),updatedDate varchar(250),pipeline varchar(250),nextStep varchar(250),closeDate varchar(250),dealType varchar(250),noOfTimesContacted varchar(250),noOfSalesActiviy varchar(250),sourceType varchar(250),forecastAmount varchar(250),mediumOfLastMeeting varchar(250),createdDate varchar(250),lostReason varchar(250),annualReccuringRevenue varchar(250),dealOwner varchar(250),lastActivityDate varchar(250),nextActivityDate varchar(250),ownerAssignedDate varchar(250),dealStage varchar(250),dealStatus varchar(250),createdbyUser varchar(250),noOfAssociatedContacts varchar(250),amount varchar(250),totalContractValue varchar(250),probability varchar(250),dealName varchar(255),dealAmount varchar(250),priority varchar(250),monthlyRecurringRevenue varchar(250),dealDescription varchar(250),amountInCompanyCurrency varchar(250),associatedCompanyId varchar(250),associatedCompany varchar(250),associatedContactId varchar(250),associatedContact varchar(250),hierarchyId varchar(255),dealAccounts varchar(1000),dealContact varchar(1000),dealProduct varchar(1000),dealDetail varchar(1000),isOnline varchar(255))',
      [],
      () => {
        console.log('All_Deal TABLE  CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    //Deal Details

    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS deal_account(mobiledealAccountId VARCHAR(255) PRIMARY KEY,mobileDealId VARCHAR(255),mobileAccountId VARCHAR(255), dealAccountId VARCHAR(100),accountId VARCHAR(100),accountName VARCHAR(100),dealId VARCHAR(100), dealName VARCHAR(255),quantity VARCHAR(50),isOnline varchar(255))',
      [],
      () => {
        console.log('TABLE  DealAccount CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    //deal_contact table modified
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS deal_contact (mobileDealContactId VARCHAR(255) PRIMARY KEY,mobileDealId VARCHAR(255),mobileContactId VARCHAR(255), dealContactId VARCHAR(100),contactId VARCHAR(100),contactName VARCHAR(100),dealId VARCHAR(255),dealName VARCHAR(255), quantity VARCHAR(50),contactPhoneNo VARCHAR(50),isOnline varchar(255))',
      [],
      () => {
        console.log('TABLE  account CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )

    //modified account table
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS account (mobileAccountId varchar(255) PRIMARY KEY, accountId varchar(255) UNIQUE, accountName varchar(255), accountDescription varchar(255), accountStatus varchar(255), accountType varchar(255), email varchar(255), website varchar(255), addressLine1 varchar(255), addressLine2 varchar(255), pinCode varchar(255), city varchar(255), state varchar(255), country varchar(255), createdBy varchar(255), createdDate varchar(255), updatedDate varchar(255), clientRelevantPersonVisited varchar(255), companyId varchar(255), updatedBy varchar(255), owner varchar(255), isOnline varchar(255))',
      [],
      () => {
        console.log('TABLE  DealContact CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )

    //new company table for account
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS company ( id INTEGER PRIMARY KEY AUTOINCREMENT, accountName varchar(255),accountDescription varchar(255),accountStatus varchar(255),accountType varchar(255),accountCode varchar(255),category varchar(255),brandName varchar(255),panNo varchar(255),serviceTaxNumber varchar(255),email varchar(255),website varchar(255),addressLine1 varchar(255),addressLine2 varchar(255),pinCode varchar(255),city varchar(255),state varchar(255),country varchar(255),clientRelevantPersonVisited varchar(50),createdBy varchar(255),updatedBy varchar(255),createdDate varchar(255),updatedDate varchar(255),companyId varchar(255),isOnline varchar(255) )',
      [],
      () => {
        console.log(' Company TABLE CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating ' + error.message)
      },
    )
    //modified contact table
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS contacts (mobileContactId VARCHAR(255) PRIMARY KEY,mobileAccountId VARCHAR(255), contactId VARCHAR(255) UNIQUE,companyId VARCHAR(255),contactName VARCHAR(255),accountId VARCHAR(255), status VARCHAR(255),source VARCHAR(255),contactUnworked VARCHAR(255),createdDate VARCHAR(255),updatedDate VARCHAR(255),sessions VARCHAR(255),phoneNo VARCHAR(255),contactOwner VARCHAR(255),eventRevenue VARCHAR(255),lastActivityDate VARCHAR(255),ownerAssignedDate VARCHAR(255),becameOpportunityDate VARCHAR(255),createdBy VARCHAR(255),contactStage VARCHAR(255),timeFirstSeen VARCHAR(255),jobTitle VARCHAR(255),emailDomain VARCHAR(255),email VARCHAR(255),associatedCompanyId VARCHAR(255),associatedCompany VARCHAR(255),hierarchyId VARCHAR(255),isOnline varchar(255))',
      [],
      () => {
        console.log('contact TABLE CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )

    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS quotation (mobileQuotationId VARCHAR(255) PRIMARY KEY,mobileAccountId VARCHAR(255),mobileContactId VARCHAR(255),quotationId varchar(255) UNIQUE,companyId VARCHAR(255),contactId VARCHAR(255),firstName VARCHAR(255),lastName VARCHAR(255),phoneNo VARCHAR(255),quotationNo VARCHAR(255),category VARCHAR(255),expiryDate VARCHAR(50),subTotal VARCHAR(255),taxPercentage VARCHAR(255),totalTax VARCHAR(255),total VARCHAR(255),paymentMethod VARCHAR(255),status VARCHAR(255),notes VARCHAR(255),storeId VARCHAR(255),storeName VARCHAR(255),accountId VARCHAR(255),accountName VARCHAR(255),createdBy VARCHAR(255),updatedBy VARCHAR(255),createdDate VARCHAR(50),updatedDate VARCHAR(50),discountedPrice VARCHAR(255),discountedPercentage VARCHAR(255),offer VARCHAR(255),sub VARCHAR(255),paymentType VARCHAR(255),fullpaymentType VARCHAR(255),paylaterType VARCHAR(255),title VARCHAR(255),dealName VARCHAR(255),owner VARCHAR(255),stage VARCHAR(255),quotationItem VARCHAR(5000),isOnline varchar(255))',
      [],
      () => {
        console.log('TABLE CREATED SUCCESSFULLY of quotation')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS employee_info (mobileEmployeeId VARCHAR(255) PRIMARY KEY,employeeId VARCHAR(255),companyId VARCHAR(255),employeeName VRACHAR(255),employeeDescription VARCHAR(255),employeeEmail VARCHAR(255) ,employeeMobile varchar(255) , employeeImage varchar(255) , employeeStatus varchar(255), dateofJoining varchar(255) ,dateofLeaving varchar(255) , addressLIne1 VARCHAR(255) ,addressLine2 VARCHAR(255)  , city VARCHAR(255) ,state VARCHAR(255) ,zipcode VARCHAR(255) ,employeeServiceCommission VARCHAR(255) ,employeeProductCommission VARCHAR(255) , createdBy VARCHAR(255) ,updatedBy VARCHAR(255) ,createdDate varchar(255) ,updatedDate varchar(255),employeeSalary VARCHAR(255) ,employeeVariableSalary VARCHAR(255) ,workScheduleJson VARCHAR(255) ,yearlyAllowableLeave VARCHAR(255) ,availableLeaveBalance VARCHAR(255) ,storeId VARCHAR(255) ,accountId VARCHAR(255) ,storeName VARCHAR(255),mobileStoreId VARCHAR(255),isOnline VARCHAR(255))',
      [],
      () => {
        console.log('EMPLOYEE TABLE CREATED SUCCESSFULLYs')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS attendance_info (id INTEGER PRIMARY KEY AUTOINCREMENT,attendanceId varchar(255),employeeId varchar(255),companyId varchar(255), employeeName varchar(255),attendanceDate varchar(255),presentAbsent varchar(255),hoursPresent varchar(255),inTime varchar(10),outTime varchar(10),totalworkinghours varchar(255),createdBy varchar(255),updatedBy varchar(255),createdDate varchar(255),updatedDate varchar(255))',
      [],
      () => {
        console.log('TABLE CREATED SUCCESSFULLY attendance_info')
      },
      error => {
        console.log('error while creating attendance_info' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS user_info (id INTEGER PRIMARY KEY AUTOINCREMENT,territory VRACHAR(30),storeName VRACHAR(30),employeeName VRACHAR(30),fullName varchar(255),title varchar(255),userName varchar(255),password varchar(255),confirmPassword varchar(255),mobileNumber varchar(255),customerStatus varchar(255))',
      [],
      () => {
        console.log('TABLE CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS territory_info (mobileTerritoryId VARCHAR(255) PRIMARY KEY, territoryId VARCHAR(255) UNIQUE,territoryName VARCHAR(255), territoryDescription VARCHAR(255),territoryType VARCHAR(255),territoryCode VARCHAR(255), parentTerritoryID VARCHAR(255), heirarchyCode VARCHAR(255),createdBy varchar(255),updatedBy varchar(255),updatedDate VARCHAR(255),createdDate varchar(255), accountId VARCHAR(255), isOnline VARCHAR(255),companyId VARCHAR(255))',
      [],
      () => {
        console.log('TABLE  territory_info CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )

    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS customer_info (mobileCustomerId VARCHAR(255) PRIMARY KEY,mobileTerritoryId  VARCHAR(255),mobileStoreId  VARCHAR(255),customerId VARCHAR(255) UNIQUE,companyId VARCHAR(255),customerName VARCHAR(255),customerMobile VARCHAR(255),customerStatus VARCHAR(255),storeId VARCHAR(255), storeName VARCHAR(255),accountId VARCHAR(255), createdDate varchar(255),createdBy VARCHAR(255),updatedDate varchar(255),updatedBy VARCHAR(255),territoryId VARCHAR(255), territoryName varchar(255),payType VARCHAR(255),isOnline VARCHAR(255))',
      [],
      () => {
        console.log('CUSTOMER TABLE CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS purchaseOrder_info (id INTEGER PRIMARY KEY AUTOINCREMENT, orderId varchar(255),orderNo varchar(255),orderDate varchar(255),productName varchar(255),Qty varchar(255),supplier varchar(255),price varchar(255), createdDate varchar(255), updatedDate varchar(255),reciever varchar(255), productId varchar(255),recieverId varchar(255),deliveryAddress varchar(255),deliverBy varchar(255),companyId varchar(255)) ',
      [],
      () => {
        console.log('purchaseOrder TABLE CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS inventory_info ( mobileProductInventoryId PRIMARY KEY, productInventoryId varchar(255) UNIQUE,productId varchar(255),productName varchar(255), productDescription varchar(255),sku varchar(255), brandName varchar(255), category varchar(255), subCategory varchar(255), mrp varchar(255),qty varchar(255),sellingprice varchar(255), discountedPrice varchar(255), status varchar(255), sizing varchar(255), taxApplicable varchar(255),taxPercentable varchar(255), createdBy varchar(255), updatedBy varchar(255), createdDate varchar(255), updatedDate varchar(255),storeId varchar(255), mobileStoreId varchar(255), isOnline varchar(255),companyId varchar(255))',
      [],
      () => {
        console.log('TABLE CREATED SUCCESSFULLY inventory_info')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS shipment_info (id INTEGER PRIMARY KEY AUTOINCREMENT,shipmentId varchar(255), storeId varchar(255),accountId varchar(255),deliveryContact varchar(255),expectedDeliveryDateTime varchar(255),deliveryBy varchar(255),deliveryAddress varchar(255),shipperContact varchar(255),shipperAddress varchar(255),shipmentItemsJson varchar(255),createdBy varchar(255),updatedBy varchar(255),createdDate varchar(255),updatedDate varchar(255),shipmentNo varchar(255),storeName varchar(255),productId varchar(255),productName varchar(255),qty varchar(255),sizing varchar(255),lotQtyPrice varchar(255),total varchar(255),status varchar(255),supplyId varchar(255),orderNo varchar(255),dispatchedQty varchar(255),pricePerUnit varchar(255),fulfillDate varchar(255),orderDate varchar(255),shippedBy varchar(255),orderedQty varchar(255),companyId varchar(255))',
      [],
      () => {
        console.log('TABLE CREATED SUCCESSFULLY shipment_info')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY AUTOINCREMENT,attendanceId varchar(255),employeeId varchar(255) ,comapnyId varchar(250) , employeeName varchar(255) ,attendanceDate varchar(255),presentAbsent varchar(255),hoursPresent varchar(255), inTime varchar(10) , outTime varchar(10) ,totalworkinghours varchar(255) , createdBy varchar(255) ,updatedBy varchar(255) ,createdDate varchar(255) ,updatedDate varchar(255))',
      [],
      () => {
        console.log('TABLE CREATED SUCCESSFULLY attendence')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS returninventory (id INTEGER PRIMARY KEY AUTOINCREMENT,returnInventoryId VRACHAR(255),productId VARCHAR(255),productName VARCHAR(255),sku VARCHAR(255),brandName VARCHAR(255),category VARCHAR(255),subCategory  VARCHAR(255),sizing VARCHAR(255),MRP VARCHAR(255),qty int(11),status VARCHAR(255),createdBy VARCHAR(255),updatedBy VARCHAR(255), createdDate varchar(255),updatedDate varchar(255),invoiceNo VARCHAR(255), returnInvoiceNo VARCHAR(255), storeId VARCHAR(255),  storeName VARCHAR(255))',
      [],
      () => {
        console.log('TABLE CREATED SUCCESSFULLY returninventory')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS offer_info (id INTEGER PRIMARY KEY AUTOINCREMENT,discountId varchar(255),companyId varchar(255) ,discountCreatedDate varchar(250) , discountPercentage varchar(255) ,discountStatus varchar(255),discountText varchar(255),discountUpdatedDate varchar(255), discountCreatedBy_userId varchar(10) , discountUpdatedBy_userId varchar(10) ,category varchar(255) , subCategory varchar(255))',
      [],
      () => {
        console.log('TABLE CREATED SUCCESSFULLY offer_info')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )

    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS company_info (companyId varchar(255) PRIMARY KEY, companyName varchar(255),companyDescription varchar(255),companyStatus varchar(255),companyType varchar(255),companyCode varchar(255),category varchar(255),brandName varchar(255),panNo varchar(255),serviceTaxNumber varchar(255),email varchar(255),website varchar(255),addressLine1 varchar(255),addressLine2 varchar(255) ,pinCode varchar(255) ,city varchar(255) ,state varchar(255) ,country varchar(255) ,clientRelevantPersonVisited varchar(50) ,createdBy varchar(255) ,updatedBy varchar(255) ,createdDate varchar(255) ,updatedDate varchar(255),owner varchar(255),isOnline varchar(255))',
      [],
      () => {
        console.log('Company TABLE CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating ' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS invoice_info (id INTEGER PRIMARY KEY AUTOINCREMENT,invoiceId varchar(255),companyId varchar(255),invoiceDate varchar(255),subTotal varchar(255),taxPercentage varchar(255),totalTax varchar(255),total varchar(255),notes varchar(255) ,invoiceStatus varchar(255),accountId varchar(255),storeId varchar(255),createdBy varchar(255),updatedBy varchar(255),createdDate varchar(255),updatedDate varchar(255),invoiceRef varchar(255),servicesJson varchar(255),productJson varchar(255),paymentMethod varchar(255),discount varchar(255),billingLevelDiscount varchar(255),serviceTaxNumber varchar(255),            termsAndConditions varchar(255),storeName varchar(255),customerId varchar(255),customerName varchar(255) ,customerMobile varchar(255),            customerEmail varchar(255),invoiceNo varchar(255) ,paidAmount varchar(255),pendingAmount varchar(255),receivedAmount varchar(255),            paymentType varchar(255),fullPaymentType varchar(255),payLaterType varchar(255))',
      [],
      () => {
        console.log('TABLE Invoice CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS product_info (id INTEGER PRIMARY KEY AUTOINCREMENT,productId VARCHAR(20),productName VARCHAR(30),productDescription VARCHAR(20),brandName VARCHAR(20),category VARCHAR(20),subCategory VARCHAR(20),sizing VARCHAR(20),mrp VARCHAR(20),quantity VARCHAR(20),status VARCHAR(20),sku VARCHAR(200))',
      [],
      () => {
        console.log('TProduct ABLE CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS notification_info (id INTEGER PRIMARY KEY AUTOINCREMENT,notificationId varchar(255),notificationData varchar(255),deviceId varchar(255),isRead varchar(255),createdDate varchar(255),updatedDate varchar(255), notificationSource varchar(255),sourceId VARCHAR(255))',
      [],
      () => {
        console.log('notification_info TABLE CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating notification_info' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS deal_product (id INTEGER PRIMARY KEY AUTOINCREMENT,deal_product_id VARCHAR(30),deal_id VARCHAR(30),deal_name VARCHAR(30),product_id VARCHAR(30),product_name VARCHAR(30),quantity VARCHAR(30)) ',
      [],
      () => {
        console.log('TABLE  DealPRoduct CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS activity_info (mobileCalendarId VARCHAR(255) PRIMARY KEY, calendarId varchar(255) UNIQUE, companyId varchar(255),calendarType varchar(255),userId varchar(255), projectHistoryId varchar(255),title varchar(255), className varchar(255), start varchar(255),end varchar(255),allDay varchar(255),createdDate varchar(255),createdBy varchar(255),updatedDate varchar(255),updatedBy varchar(255),activityDate varchar(255),activityTime varchar(255),category varchar(255),refId varchar(45),refName varchar(45),status varchar(45),owner varchar(45),name varchar(45),priority varchar(255),associateRecords varchar(255),dueDate varchar(255),reminder varchar(255),contactId varchar(255),accountId varchar(255),dealId varchar(255),hierarchyId varchar(255),startDate varchar(255),endDate varchar(255),actualStartDate varchar(255),actualEndDate varchar(255),activityStatus varchar(255),mobileRefId varchar(255),refType varchar(255),isOnline varchar(255))',
      [],
      () => {
        console.log('ACTIVITY CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS note_info (mobileNoteId VARCHAR(255) PRIMARY KEY, noteId varchar(255) UNIQUE,companyId varchar(255),name VARCHAR(255),owner VARCHAR(255),status VARCHAR(255),createDate VARCHAR(255),createdBy VARCHAR(255) ,updateDate VARCHAR(255) ,updatedBy VARCHAR(255),refId VARCHAR(255),description VARCHAR(255),refType VARCHAR(255),mobileRefId VARCHAR(255), isOnline VARCHAR(255))',
      [],
      () => {
        console.log('TABLE NOTES CREATED SUCCESSFULLY')
      },
      error => {
        console.log('error while creating' + error.message)
      },
    )
  })
}
