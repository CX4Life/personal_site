import os


class TableBacked:
    def __init__(self, table_name, table_service):
        self.table_name = table_name
        self._service = table_service
        self._next_row_key_by_partition = self._create_row_key_lookup()

    def _create_row_key_lookup(self):
        lookup = {}
        rows = self._service.query_entities(
            self.table_name, select="PartitionKey, RowKey"
        )

        for row in rows:
            part = row["PartitionKey"]
            rowKey = int(row["RowKey"])
            if part in lookup:
                lookup[part] = max(lookup[part], rowKey)
            else:
                lookup[part] = rowKey
        return lookup

    @staticmethod
    def _pad_row_key(rowkey):
        return str(rowkey).zfill(6)

    @staticmethod
    def _partition_filter(partition):
        return "PartitionKey eq '{}'".format(partition)

    def _get_next_row_id(self, partition):
        if partition in self._next_row_key_by_partition:
            key = self._next_row_key_by_partition[partition]
            self._next_row_key_by_partition[partition] += 1
            return key + 1
        else:
            rows = self._service.query_entities(
                self.table_name, select="PartitionKey, RowKey"
            )
            max_key = 1
            for row in rows:
                max_key = max(max_key, int(row["RowKey"]))
            self._next_row_key_by_partition[partition] = max_key
            return max_key + 1

    def _dict_to_entity(self, partition, dict):
        dict["PartitionKey"] = partition
        dict["RowKey"] = self._pad_row_key(self._get_next_row_id(partition))
        return dict

    def get_by_partiton(self, partition):
        return self._service.query_entities(
            self.table_name, filter=self._partition_filter(partition)
        )

    def get_all(self):
        return [x for x in self._service.query_entities(self.table_name)]

    def get_single(self, partition, row):
        return self._service.get_entity(
            self.table_name, partition, self._pad_row_key(row)
        )

    def add_entity(self, partition, dictionary):
        self._service.insert_entity(
            self.table_name, self._dict_to_entity(partition, dictionary)
        )
        return {
            "partition": partition,
            "key": self._next_row_key_by_partition[partition],
        }

